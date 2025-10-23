/**
 * DailyHush - F.I.R.E. Training Service
 * Handles save/resume functionality and progress tracking
 */

import { supabase } from '@/utils/supabase';
import { FireModule } from '@/types';

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
 * Save or update module progress
 */
export async function saveModuleProgress(
  userId: string,
  module: FireModule,
  data: Partial<ModuleProgress>
): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: any = {
      user_id: userId,
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
    const { error } = await supabase
      .from('fire_training_progress')
      .upsert(updateData, {
        onConflict: 'user_id,module',
      });

    if (error) {
      console.error('Error saving module progress:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in saveModuleProgress:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Load module progress for a specific module
 */
export async function loadModuleProgress(
  userId: string,
  module: FireModule
): Promise<{ data: ModuleProgress | null; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('fire_training_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('module', module)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned, which is fine
      console.error('Error loading module progress:', error);
      return { data: null, error: error.message };
    }

    if (!data) {
      return { data: null };
    }

    // Transform database format to app format
    const moduleProgress: ModuleProgress = {
      module: data.module as FireModule,
      completed: data.completed || false,
      currentScreen: data.current_screen,
      lastAccessedAt: data.last_accessed_at,
    };

    // Add module-specific data
    if (module === FireModule.FOCUS && data.selected_triggers) {
      moduleProgress.focusData = {
        selectedTriggers: data.selected_triggers,
      };
    }

    if (module === FireModule.INTERRUPT) {
      moduleProgress.interruptData = {
        selectedPhysicalSigns: data.selected_physical_signs || [],
        selectedMentalCues: data.selected_mental_cues || [],
      };
    }

    if (module === FireModule.REFRAME && data.reframe_text) {
      moduleProgress.reframeData = {
        reframeText: data.reframe_text,
      };
    }

    if (module === FireModule.EXECUTE) {
      moduleProgress.executeData = {
        selectedRoutines: data.selected_routines || [],
        selectedEnvironment: data.selected_environment || [],
      };
    }

    return { data: moduleProgress };
  } catch (error: any) {
    console.error('Error in loadModuleProgress:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Load all module progress for a user
 */
export async function loadAllModuleProgress(
  userId: string
): Promise<{ data: ModuleProgress[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('fire_training_progress')
      .select('*')
      .eq('user_id', userId)
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
 * Update user's fire_progress in user_profiles table
 * This is for the training index to show completion status
 */
export async function updateUserFireProgress(
  userId: string,
  module: FireModule,
  completed: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get current fire_progress
    const { data: userData, error: fetchError } = await supabase
      .from('user_profiles')
      .select('fire_progress')
      .eq('user_id', userId)
      .single();

    if (fetchError) {
      console.error('Error fetching user profile:', fetchError);
      return { success: false, error: fetchError.message };
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
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating user fire progress:', updateError);
      return { success: false, error: updateError.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in updateUserFireProgress:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get user's F.I.R.E. certification status
 */
export async function getFIRECertificationStatus(
  userId: string
): Promise<{ certified: boolean; completedModules: number; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('fire_progress')
      .eq('user_id', userId)
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
