import { useQuery, useMutation } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';

// ============ Auth Hooks ============
export function useSignup() {
  return useMutation({
    mutationFn: (data) =>
      apiFetch('/api/auth/signup', {
        method: 'POST',
        body: data,
        skipAuthRedirect: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: (data) =>
      apiFetch('/api/verify-otp', {
        method: 'POST',
        body: data,
        skipAuthRedirect: true,
      }),
  });
}

export function useResendOtp() {
  return useMutation({
    mutationFn: (data) =>
      apiFetch('/api/resend-otp', {
        method: 'POST',
        body: data,
        skipAuthRedirect: true,
      }),
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: ({ token, body }) =>
      apiFetch(`/api/auth/verify-email/${token}`, {
        method: 'POST',
        body,
        skipAuthRedirect: true,
      }),
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: (data) =>
      apiFetch('/api/auth/resend-verification', {
        method: 'POST',
        body: data,
      }),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data) =>
      apiFetch('/api/auth/reset-password', {
        method: 'POST',
        body: data,
        skipAuthRedirect: true,
      }),
  });
}

// ============ Profile Hooks ============
export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () =>
      apiFetch('/api/profile/me', {
        skipAuthRedirect: false,
      }),
    retry: 1,
  });
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (data) =>
      apiFetch('/api/profile/me', {
        method: 'PUT',
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

// ============ Exam Hooks ============
export function useLiveExams() {
  return useQuery({
    queryKey: ['exams', 'live'],
    queryFn: () => apiFetch('/api/exam/live'),
    staleTime: 1000 * 60 * 2, // 2 minutes for live exams
  });
}

export function useUpcomingExams() {
  return useQuery({
    queryKey: ['exams', 'upcoming'],
    queryFn: () => apiFetch('/api/exam/upcoming'),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// ============ Exam Attempt Hooks ============
export function useExamAttempt(examId) {
  return useQuery({
    queryKey: ['exam-attempt', examId],
    queryFn: () => apiFetch(`/api/exam-attempt/${examId}/attempt`),
    enabled: !!examId,
    staleTime: 1000 * 60, // 1 minute for exam attempts
  });
}

export function useSaveExamAnswer() {
  return useMutation({
    mutationFn: ({ examId, data }) =>
      apiFetch(`/api/exam-attempt/${examId}/save`, {
        method: 'POST',
        body: data,
      }),
  });
}

export function useSubmitExam() {
  return useMutation({
    mutationFn: (examId) =>
      apiFetch(`/api/exam-attempt/${examId}/submit`, {
        method: 'POST',
      }),
  });
}

// ============ Results Hooks ============
export function useExamResults(examAttemptId) {
  return useQuery({
    queryKey: ['exam-results', examAttemptId],
    queryFn: () => apiFetch(`/api/result/${examAttemptId}`),
    enabled: !!examAttemptId,
  });
}
