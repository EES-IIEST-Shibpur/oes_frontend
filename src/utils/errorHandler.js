/**
 * Utility functions for handling different types of API errors
 */

export function isNetworkError(error) {
  if (!error) return false;
  
  // Check if it's a network error from apiFetch
  if (error.isNetworkError || error.isOffline) return true;
  
  // Check network status
  if (typeof navigator !== 'undefined' && !navigator.onLine) return true;
  
  // Check error message
  const message = error?.message?.toLowerCase() || '';
  return message.includes('fetch') || 
         message.includes('network') ||
         message.includes('failed to') ||
         message.includes('connection');
}

export function getErrorMessage(error) {
  if (!error) return 'An unknown error occurred';
  
  // Network/offline errors
  if (isNetworkError(error)) {
    return 'Server is offline. Answers are being saved locally. They will sync when connection is restored.';
  }
  
  // Timeout errors
  if (error?.message?.toLowerCase().includes('timeout')) {
    return 'Request timed out. Please check your connection and try again.';
  }
  
  // Custom error messages
  if (error?.data?.message) {
    return error.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'Failed to complete request. Please try again.';
}

export function shouldRetry(error) {
  if (!error) return true;
  
  // Don't retry auth errors
  if (error.status === 401 || error.status === 403) return false;
  
  // Retry network errors and 5xx errors
  if (isNetworkError(error) || (error.status >= 500 && error.status < 600)) {
    return true;
  }
  
  // Don't retry 4xx client errors (except 408, 429)
  if (error.status >= 400 && error.status < 500) {
    return [408, 429].includes(error.status);
  }
  
  return true;
}

export function isOfflineError(error) {
  return isNetworkError(error);
}
