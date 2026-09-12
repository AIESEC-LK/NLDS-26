export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelayMs: number = 1000,
): Promise<T> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await operation();
    } catch (error: any) {
      attempt++;
      
      // Fast-fail if max retries reached
      if (attempt >= maxRetries) {
        throw error;
      }
      
      // Determine if error is retryable (429, 5xx, or quota strings)
      const status = error?.response?.status || error?.code;
      const isRetryable =
        status === 429 ||
        status >= 500 ||
        error?.message?.toLowerCase().includes("quota") ||
        error?.message?.toLowerCase().includes("rate limit") ||
        error?.message?.toLowerCase().includes("too many requests");
      
      if (!isRetryable) {
        // Non-retryable error (e.g., 400 Bad Request, 403 Forbidden)
        throw error;
      }

      // Exponential backoff with jitter (prevent thundering herd)
      const jitter = Math.random() * 500;
      const delay = baseDelayMs * Math.pow(2, attempt - 1) + jitter;
      
      console.warn(
        `[Retry] Operation failed. Retrying attempt ${attempt + 1}/${maxRetries} in ${Math.round(delay)}ms...`,
      );
      
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Retry failed");
}
