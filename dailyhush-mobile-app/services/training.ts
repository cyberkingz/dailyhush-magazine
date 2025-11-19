/**
 * Nœma - F.I.R.E. Training Service
 * Handles save/resume functionality and progress tracking
 */

import { supabase } from '@/utils/supabase';
import { FireModule } from '@/types';
// import { isAuthenticated } from '@/services/auth';

// Error types for better error handling
export enum TrainingServiceError {
  NETWORK_ERROR = 'NETWORK_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
};

const isTrainingLoggingEnabled = process.env.EXPO_PUBLIC_FIRE_DEBUG === 'true';

function logTraining(...messages: unknown[]) {
  if (isTrainingLoggingEnabled) {
    console.log('[training]', ...messages);
  }
}

/**
 * Retry a function with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = RETRY_CONFIG.maxRetries,
  delay = RETRY_CONFIG.initialDelay
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    // Don't retry validation errors or if we've exhausted retries
    if (retries === 0 || error.code === 'VALIDATION_ERROR') {
      throw error;
    }

    // Only retry network errors and timeouts
    const shouldRetry =
      error.code === 'NETWORK_ERROR' ||
      error.code === 'TIMEOUT_ERROR' ||
      error.message?.includes('network') ||
      error.message?.includes('timeout') ||
      error.message?.includes('fetch');

    if (!shouldRetry) {
      throw error;
    }

    // Wait with exponential backoff
    const nextDelay = Math.min(delay * RETRY_CONFIG.backoffMultiplier, RETRY_CONFIG.maxDelay);
    logTraining(`Retrying in ${delay}ms... (${retries} retries left)`);

    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryWithBackoff(fn, retries - 1, nextDelay);
  }
}

/**
 * Categorize error for better handling
 */
function categorizeError(error: any): { type: TrainingServiceError; message: string } {
  if (!error) {
    return { type: TrainingServiceError.UNKNOWN_ERROR, message: 'Unknown error occurred' };
  }

  const errorMessage = error.message?.toLowerCase() || '';

  // Network errors
  if (
    errorMessage.includes('network') ||
    errorMessage.includes('fetch') ||
    errorMessage.includes('connection') ||
    error.code === 'ECONNREFUSED' ||
    error.code === 'ENOTFOUND'
  ) {
    return {
      type: TrainingServiceError.NETWORK_ERROR,
      message: 'Network connection error. Please check your internet connection.',
    };
  }

  // Timeout errors
  if (errorMessage.includes('timeout') || error.code === 'ETIMEDOUT') {
    return {
      type: TrainingServiceError.TIMEOUT_ERROR,
      message: 'Request timed out. Please try again.',
    };
  }

  // Database errors
  if (error.code?.startsWith('PGRST') || errorMessage.includes('database')) {
    return {
      type: TrainingServiceError.DATABASE_ERROR,
      message: 'Database error. Please try again.',
    };
  }

  // Validation errors
  if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
    return { type: TrainingServiceError.VALIDATION_ERROR, message: error.message };
  }

  return {
    type: TrainingServiceError.UNKNOWN_ERROR,
    message: error.message || 'An unexpected error occurred',
  };
}

// Type definitions for module-specific data
export interface FocusModuleData {
  selectedTriggers: string[];
}

export interface InterruptModuleData {
  selectedPhysicalSigns: string[];
  selectedMentalCues: string[];
}

export interface ReframeModuleData {
  reframeText: string;
}

export interface ExecuteModuleData {
  selectedRoutines: string[];
  selectedEnvironment: string[];
}

export interface ModuleProgress {
  module: FireModule;
  completed: boolean;
  currentScreen?: string;
  lastAccessedAt?: string;
  // Module-specific data
  focusData?: FocusModuleData;
  interruptData?: InterruptModuleData;
  reframeData?: ReframeModuleData;
  executeData?: ExecuteModuleData;
}

/**
 * Check if a user ID is a valid UUID (not a temporary ID)
 */
// function isValidUUID(userId: string): boolean {
//   const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
//   return uuidRegex.test(userId);
// }

/**
 * Save or update module progress with retry logic
 */
export async function saveModuleProgress(
  userId: string,
  module: FireModule,
  data: Partial<ModuleProgress>
): Promise<{ success: boolean; error?: string; errorType?: TrainingServiceError }> {
  // Get the actual authenticated user from Supabase
  // This is critical because anonymous users might not have a user_profiles record,
  // but they do have an auth.uid() which is what RLS policies check against
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    console.log('No authenticated user found, skipping save');
    return { success: true }; // Return success to avoid blocking UI
  }

  // Use the authenticated user ID (works for both anonymous and email users)
  const actualUserId = authUser.id;
  logTraining('Saving progress for user:', actualUserId, 'isAnonymous:', authUser.is_anonymous);

  if (!module) {
    return {
      success: false,
      error: 'Module is required',
      errorType: TrainingServiceError.VALIDATION_ERROR,
    };
  }

  try {
    // Use retry with backoff for network resilience
    await retryWithBackoff(async () => {
      const updateData: any = {
        user_id: actualUserId, // Use auth.uid() instead of passed userId
        module,
        last_accessed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Add current screen if provided
      if (data.currentScreen) {
        updateData.current_screen = data.currentScreen;
      }

      // Add module-specific data
      if (data.focusData) {
        updateData.selected_triggers = data.focusData.selectedTriggers;
      }

      if (data.interruptData) {
        updateData.selected_physical_signs = data.interruptData.selectedPhysicalSigns;
        updateData.selected_mental_cues = data.interruptData.selectedMentalCues;
      }

      if (data.reframeData) {
        updateData.reframe_text = data.reframeData.reframeText;
      }

      if (data.executeData) {
        updateData.selected_routines = data.executeData.selectedRoutines;
        updateData.selected_environment = data.executeData.selectedEnvironment;
      }

      // Add completion status if provided
      if (data.completed !== undefined) {
        updateData.completed = data.completed;
        if (data.completed) {
          updateData.completed_at = new Date().toISOString();
        }
      }

      // Upsert (insert or update)
      const { error } = await supabase.from('fire_training_progress').upsert(updateData, {
        onConflict: 'user_id,module',
      });

      if (error) {
        const categorized = categorizeError(error);
        console.error('Error saving module progress:', error);
        throw { ...error, ...categorized };
      }
    });

    return { success: true };
  } catch (error: any) {
    const categorized = categorizeError(error);
    console.error('Error in saveModuleProgress:', categorized);
    return {
      success: false,
      error: categorized.message,
      errorType: categorized.type,
    };
  }
}

/**
 * Load module progress for a specific module with retry logic
 */
export async function loadModuleProgress(
  userId: string,
  module: FireModule
): Promise<{ data: ModuleProgress | null; error?: string; errorType?: TrainingServiceError }> {
  // Get the actual authenticated user from Supabase
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    logTraining('No authenticated user found, skipping load');
    return { data: null }; // Return null to start fresh
  }

  // Use the authenticated user ID (works for both anonymous and email users)
  const actualUserId = authUser.id;
  logTraining('Loading progress for user:', actualUserId, 'isAnonymous:', authUser.is_anonymous);

  if (!module) {
    return {
      data: null,
      error: 'Module is required',
      errorType: TrainingServiceError.VALIDATION_ERROR,
    };
  }

  try {
    // Use retry with backoff for network resilience
    const result = await retryWithBackoff(async () => {
      const { data, error } = await supabase
        .from('fire_training_progress')
        .select('*')
        .eq('user_id', actualUserId) // Use auth.uid() instead of passed userId
        .eq('module', module)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned, which is fine
        const categorized = categorizeError(error);
        console.error('Error loading module progress:', error);
        throw { ...error, ...categorized };
      }

      return data;
    });

    if (!result) {
      return { data: null };
    }

    // Transform database format to app format
    const moduleProgress: ModuleProgress = {
      module: result.module as FireModule,
      completed: result.completed || false,
      currentScreen: result.current_screen,
      lastAccessedAt: result.last_accessed_at,
    };

    // Add module-specific data
    if (module === FireModule.FOCUS && result.selected_triggers) {
      moduleProgress.focusData = {
        selectedTriggers: result.selected_triggers,
      };
    }

    if (module === FireModule.INTERRUPT) {
      moduleProgress.interruptData = {
        selectedPhysicalSigns: result.selected_physical_signs || [],
        selectedMentalCues: result.selected_mental_cues || [],
      };
    }

    if (module === FireModule.REFRAME && result.reframe_text) {
      moduleProgress.reframeData = {
        reframeText: result.reframe_text,
      };
    }

    if (module === FireModule.EXECUTE) {
      moduleProgress.executeData = {
        selectedRoutines: result.selected_routines || [],
        selectedEnvironment: result.selected_environment || [],
      };
    }

    return { data: moduleProgress };
  } catch (error: any) {
    const categorized = categorizeError(error);
    console.error('Error in loadModuleProgress:', categorized);
    return {
      data: null,
      error: categorized.message,
      errorType: categorized.type,
    };
  }
}

/**
 * Load all module progress for a user
 */
export async function loadAllModuleProgress(
  userId: string
): Promise<{ data: ModuleProgress[]; error?: string }> {
  // Get the actual authenticated user from Supabase
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    logTraining('No authenticated user found, skipping load all');
    return { data: [] };
  }

  // Use the authenticated user ID (works for both anonymous and email users)
  const actualUserId = authUser.id;

  try {
    const { data, error } = await supabase
      .from('fire_training_progress')
      .select('*')
      .eq('user_id', actualUserId) // Use auth.uid() instead of passed userId
      .order('last_accessed_at', { ascending: false });

    if (error) {
      console.error('Error loading all module progress:', error);
      return { data: [], error: error.message };
    }

    const moduleProgress: ModuleProgress[] = (data || []).map((row) => ({
      module: row.module as FireModule,
      completed: row.completed || false,
      currentScreen: row.current_screen,
      lastAccessedAt: row.last_accessed_at,
      focusData:
        row.module === FireModule.FOCUS && row.selected_triggers
          ? { selectedTriggers: row.selected_triggers }
          : undefined,
      interruptData:
        row.module === FireModule.INTERRUPT
          ? {
              selectedPhysicalSigns: row.selected_physical_signs || [],
              selectedMentalCues: row.selected_mental_cues || [],
            }
          : undefined,
      reframeData:
        row.module === FireModule.REFRAME && row.reframe_text
          ? { reframeText: row.reframe_text }
          : undefined,
      executeData:
        row.module === FireModule.EXECUTE
          ? {
              selectedRoutines: row.selected_routines || [],
              selectedEnvironment: row.selected_environment || [],
            }
          : undefined,
    }));

    return { data: moduleProgress };
  } catch (error: any) {
    console.error('Error in loadAllModuleProgress:', error);
    return { data: [], error: error.message };
  }
}

/**
 * Mark a module as completed
 */
export async function completeModule(
  userId: string,
  module: FireModule
): Promise<{ success: boolean; error?: string }> {
  return saveModuleProgress(userId, module, { completed: true });
}

/**
 * Update user's fire_progress in user_profiles table with retry logic
 * This is for the training index to show completion status
 */
export async function updateUserFireProgress(
  userId: string,
  module: FireModule,
  completed: boolean
): Promise<{ success: boolean; error?: string; errorType?: TrainingServiceError }> {
  // Get the actual authenticated user from Supabase
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    console.log('No authenticated user found, skipping fire progress update');
    return { success: true }; // Return success to avoid blocking UI
  }

  // Use the authenticated user ID (works for both anonymous and email users)
  const actualUserId = authUser.id;
  logTraining(
    'Updating fire progress for user:',
    actualUserId,
    'isAnonymous:',
    authUser.is_anonymous
  );

  if (!module) {
    return {
      success: false,
      error: 'Module is required',
      errorType: TrainingServiceError.VALIDATION_ERROR,
    };
  }

  try {
    // Use retry with backoff for network resilience
    await retryWithBackoff(async () => {
      // Get current fire_progress
      const { data: userData, error: fetchError } = await supabase
        .from('user_profiles')
        .select('fire_progress')
        .eq('user_id', actualUserId) // Use auth.uid() instead of passed userId
        .single();

      if (fetchError) {
        const categorized = categorizeError(fetchError);
        console.error('Error fetching user profile:', fetchError);
        throw { ...fetchError, ...categorized };
      }

      const fireProgress = userData?.fire_progress || {
        focus: false,
        interrupt: false,
        reframe: false,
        execute: false,
      };

      // Update the specific module
      fireProgress[module] = completed;

      // Update in database
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ fire_progress: fireProgress, updated_at: new Date().toISOString() })
        .eq('user_id', actualUserId); // Use auth.uid() instead of passed userId

      if (updateError) {
        const categorized = categorizeError(updateError);
        console.error('Error updating user fire progress:', updateError);
        throw { ...updateError, ...categorized };
      }
    });

    return { success: true };
  } catch (error: any) {
    const categorized = categorizeError(error);
    console.error('Error in updateUserFireProgress:', categorized);
    return {
      success: false,
      error: categorized.message,
      errorType: categorized.type,
    };
  }
}

/**
 * Get user's F.I.R.E. certification status
 */
export async function getFIRECertificationStatus(
  userId: string
): Promise<{ certified: boolean; completedModules: number; error?: string }> {
  // Get the actual authenticated user from Supabase
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    console.log('No authenticated user found, skipping certification check');
    return { certified: false, completedModules: 0 };
  }

  // Use the authenticated user ID (works for both anonymous and email users)
  const actualUserId = authUser.id;

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('fire_progress')
      .eq('user_id', actualUserId) // Use auth.uid() instead of passed userId
      .single();

    if (error) {
      console.error('Error fetching FIRE certification status:', error);
      return { certified: false, completedModules: 0, error: error.message };
    }

    const fireProgress = data?.fire_progress || {
      focus: false,
      interrupt: false,
      reframe: false,
      execute: false,
    };

    const completedModules = Object.values(fireProgress).filter(Boolean).length;
    const certified = completedModules === 4;

    return { certified, completedModules };
  } catch (error: any) {
    console.error('Error in getFIRECertificationStatus:', error);
    return { certified: false, completedModules: 0, error: error.message };
  }
}
