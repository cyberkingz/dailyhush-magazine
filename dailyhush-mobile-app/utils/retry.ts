/**
 * Retry utility for database operations
 * Implements exponential backoff for transient failures
 */

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number, error: any) => void;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
  onRetry: () => {},
};

/**
 * Retry a database operation with exponential backoff
 *
 * @param operation - Async function to retry
 * @param options - Retry configuration
 * @returns Result of the operation
 * @throws Last error if all retries exhausted
 *
 * @example
 * const result = await retryOperation(
 *   () => supabase.from('spiral_logs').insert(data),
 *   { maxRetries: 3, onRetry: (attempt) => console.log(`Retry ${attempt}`) }
 * );
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const config = { ...DEFAULT_OPTIONS, ...options };
  let lastError: any;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      const result = await operation();

      // Check for Supabase-style error response
      if (result && typeof result === 'object' && 'error' in result) {
        const { error } = result as any;

        if (error) {
          // Determine if error is retryable
          if (!isRetryableError(error) || attempt === config.maxRetries) {
            throw error;
          }
          lastError = error;
        } else {
          // Success
          return result;
        }
      } else {
        // Success (non-Supabase response)
        return result;
      }
    } catch (error: any) {
      lastError = error;

      // Don't retry if not retryable or max retries reached
      if (!isRetryableError(error) || attempt === config.maxRetries) {
        throw error;
      }
    }

    // Calculate delay with exponential backoff
    const delay = Math.min(
      config.initialDelay * Math.pow(config.backoffMultiplier, attempt),
      config.maxDelay
    );

    // Call onRetry callback
    config.onRetry(attempt + 1, lastError);

    console.log(`Retry attempt ${attempt + 1}/${config.maxRetries} after ${delay}ms delay`);

    // Wait before retry
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  // All retries exhausted
  throw lastError;
}

/**
 * Determine if an error is retryable (transient network/server error)
 *
 * @param error - Error object to check
 * @returns true if error is retryable
 */
function isRetryableError(error: any): boolean {
  if (!error) return false;

  // Network errors
  if (error.message?.includes('network') ||
      error.message?.includes('timeout') ||
      error.message?.includes('ECONNREFUSED')) {
    return true;
  }

  // HTTP status codes that are retryable
  const retryableStatusCodes = [
    408, // Request Timeout
    429, // Too Many Requests
    500, // Internal Server Error
    502, // Bad Gateway
    503, // Service Unavailable
    504, // Gateway Timeout
  ];

  if (error.status && retryableStatusCodes.includes(error.status)) {
    return true;
  }

  // Supabase-specific transient errors
  if (error.code === 'PGRST301' || // Connection error
      error.code === '08000' || // Connection exception
      error.code === '08003') { // Connection does not exist
    return true;
  }

  return false;
}

/**
 * Wrapper for Supabase database operations with automatic retry
 *
 * @example
 * await withRetry(() =>
 *   supabase.from('user_profiles').update({ name }).eq('user_id', userId)
 * );
 */
export async function withRetry<T>(
  operation: () => Promise<{ data: T | null; error: any } | T>,
  options?: RetryOptions
): Promise<{ data: T | null; error: any }> {
  try {
    const result = await retryOperation(operation, options);

    // Handle Supabase-style response
    if (result && typeof result === 'object' && 'data' in result && 'error' in result) {
      return result as { data: T | null; error: any };
    }

    // Wrap non-Supabase response
    return { data: result as T, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
