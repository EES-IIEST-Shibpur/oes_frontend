"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { isNetworkError } from '@/utils/errorHandler';

/**
 * Hook to manage offline state and retry logic
 * Stores failed saves locally and retries when connection is restored
 */
export function useOfflineQueue() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingAnswers, setPendingAnswers] = useState([]);
  const retryTimeoutRef = useRef(null);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Add answer to pending queue
  const queueAnswer = useCallback((examId, questionId, answerData) => {
    setPendingAnswers((prev) => {
      // Remove duplicate for same question
      const filtered = prev.filter(a => a.questionId !== questionId);
      return [...filtered, { examId, questionId, data: answerData, timestamp: Date.now() }];
    });

    // Save to localStorage as backup
    try {
      const stored = JSON.parse(localStorage.getItem('pendingAnswers') || '{}');
      stored[questionId] = answerData;
      localStorage.setItem('pendingAnswers', JSON.stringify(stored));
    } catch (e) {
      console.error('Failed to store pending answers:', e);
    }
  }, []);

  // Clear pending answer
  const clearPending = useCallback((questionId) => {
    setPendingAnswers((prev) => prev.filter(a => a.questionId !== questionId));
    
    try {
      const stored = JSON.parse(localStorage.getItem('pendingAnswers') || '{}');
      delete stored[questionId];
      localStorage.setItem('pendingAnswers', JSON.stringify(stored));
    } catch (e) {
      console.error('Failed to clear pending answers:', e);
    }
  }, []);

  // Load pending answers from localStorage
  const loadPendingAnswers = useCallback(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('pendingAnswers') || '{}');
      return stored;
    } catch (e) {
      console.error('Failed to load pending answers:', e);
      return {};
    }
  }, []);

  // Clear all pending answers
  const clearAllPending = useCallback(() => {
    setPendingAnswers([]);
    try {
      localStorage.removeItem('pendingAnswers');
    } catch (e) {
      console.error('Failed to clear all pending answers:', e);
    }
  }, []);

  return {
    isOnline,
    pendingAnswers,
    queueAnswer,
    clearPending,
    loadPendingAnswers,
    clearAllPending,
  };
}

/**
 * Hook to handle automatic retry with exponential backoff
 */
export function useRetry() {
  const retryTimeoutRef = useRef(null);

  const retry = useCallback((fn, options = {}) => {
    const { maxAttempts = 3, initialDelay = 1000, maxDelay = 10000 } = options;
    let attempt = 0;

    const executeRetry = async () => {
      try {
        attempt++;
        return await fn();
      } catch (error) {
        if (attempt >= maxAttempts || !isNetworkError(error)) {
          throw error;
        }

        // Exponential backoff
        const delay = Math.min(initialDelay * Math.pow(2, attempt - 1), maxDelay);
        
        return new Promise((resolve, reject) => {
          retryTimeoutRef.current = setTimeout(() => {
            executeRetry().then(resolve).catch(reject);
          }, delay);
        });
      }
    };

    return executeRetry();
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  return { retry };
}
