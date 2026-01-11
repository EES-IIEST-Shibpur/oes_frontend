# React Query Optimization - Implementation Summary

## Overview
Successfully integrated React Query (@tanstack/react-query) across the frontend application to optimize API calling, reduce boilerplate code, enable automatic caching, and improve performance with features like deduplication and background refetching.

## Files Created

### 1. [src/lib/queryClient.js](src/lib/queryClient.js)
- Centralized React Query configuration with sensible defaults
- Default query stale time: 5 minutes
- Default cache time: 10 minutes
- Retry logic enabled
- Disables automatic refetch on window focus to reduce unnecessary API calls

### 2. [src/providers/ReactQueryProvider.jsx](src/providers/ReactQueryProvider.jsx)
- React Query provider component that wraps the application
- Provides the configured QueryClient to all components
- Integrated into root layout for global access

### 3. [src/hooks/useApi.js](src/hooks/useApi.js)
- Comprehensive custom hooks for all API endpoints
- **Query Hooks** (read operations):
  - `useProfile()` - Fetch user profile
  - `useLiveExams()` - Fetch live exams
  - `useUpcomingExams()` - Fetch upcoming exams
  - `useExamAttempt(examId)` - Fetch exam questions and student answers
  - `useExamResults(examAttemptId)` - Fetch exam results
  
- **Mutation Hooks** (write operations):
  - `useSignup()` - Register new user
  - `useVerifyOtp()` - Verify OTP during signup
  - `useResendOtp()` - Resend OTP
  - `useVerifyEmail()` - Verify email with token
  - `useResendVerification()` - Resend email verification
  - `useResetPassword()` - Reset user password
  - `useUpdateProfile()` - Update user profile
  - `useSaveExamAnswer()` - Save exam answer
  - `useSubmitExam()` - Submit exam

## Files Modified

### 1. [src/app/layout.js](src/app/layout.js)
- Added `ReactQueryProvider` wrapping the entire application
- Ensures React Query is available globally

### 2. [src/app/exam/[examId]/page.jsx](src/app/exam/[examId]/page.jsx)
- Replaced manual `useEffect` with `useExamAttempt()` hook
- Replaced separate save/submit fetch calls with `useSaveExamAnswer()` and `useSubmitExam()` mutations
- Changed from `loading`, `saving`, `submitting` state flags to `isLoading` and mutation `isPending` properties
- Removed manual fetch error handling - delegated to React Query

### 3. [src/app/dashboard/page.jsx](src/app/dashboard/page.jsx)
- Replaced three separate `useEffect` calls with `useProfile()`, `useLiveExams()`, and `useUpcomingExams()` hooks
- Unified loading state management
- Removed manual state management for user data and exam lists
- Query results automatically refetch based on stale time

### 4. [src/app/profile/page.jsx](src/app/profile/page.jsx)
- Replaced manual `fetchProfile()` with `useProfile()` hook
- Replaced manual profile update mutation with `useUpdateProfile()` hook
- Changed from `loading`/`saving` flags to `isLoading` and mutation `isPending`
- Automatic profile data invalidation and refetch on successful update

### 5. [src/app/signup/page.jsx](src/app/signup/page.jsx)
- Replaced manual signup mutation with `useSignup()` hook
- Removed `loading` state in favor of `mutation.isPending`
- Simplified error and success handling

### 6. [src/app/verify-otp/page.jsx](src/app/verify-otp/page.jsx)
- Replaced manual OTP verification mutation with `useVerifyOtp()` hook
- Replaced manual resend OTP mutation with `useResendOtp()` hook
- Removed manual `loading`/`resending` state management

### 7. [src/app/verify-email/page.jsx](src/app/verify-email/page.jsx)
- Replaced manual email verification mutation with `useVerifyEmail()` hook
- Replaced manual resend verification mutation with `useResendVerification()` hook
- Removed manual `resending` state

### 8. [src/app/reset-password/page.jsx](src/app/reset-password/page.jsx)
- Replaced manual password reset mutation with `useResetPassword()` hook
- Removed manual `loading` state in favor of mutation `isPending`
- Added disabled state to button during reset operation

## Key Benefits

### 1. **Reduced Boilerplate**
- Custom hooks eliminate repetitive `useState` and `useEffect` patterns
- Standardized error handling across all API calls
- Consistent loading/pending state management

### 2. **Automatic Caching**
- Query results are automatically cached based on stale time
- Prevents unnecessary duplicate API calls
- Configurable cache duration (default 10 minutes)

### 3. **Data Invalidation**
- Mutations automatically invalidate related queries
- Example: After updating profile, profile query is automatically refetched
- No manual cache management needed

### 4. **Background Refetching**
- Stale queries refetch automatically in the background
- Users always see fresh data without blocking the UI
- Configurable stale time (default 5 minutes)

### 5. **Better UX**
- Automatic deduplication of concurrent requests
- Consistent error handling
- Loading states managed per operation (not globally)

### 6. **Developer Experience**
- Simple API: `const { data, isLoading, error } = useQuery(...)`
- Powerful mutation API: `const { mutateAsync, isPending } = useMutation(...)`
- Query key structure enables easy debugging
- DevTools integration available (react-query/devtools)

## Usage Examples

### Using a Query Hook
```jsx
const { data, isLoading, error } = useProfile();

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;

return <div>{data?.fullName}</div>;
```

### Using a Mutation Hook
```jsx
const updateProfileMutation = useUpdateProfile();

const handleSave = async () => {
  try {
    await updateProfileMutation.mutateAsync(formData);
    showSuccessMessage();
  } catch (err) {
    showErrorMessage(err);
  }
};

return (
  <button disabled={updateProfileMutation.isPending}>
    {updateProfileMutation.isPending ? 'Saving...' : 'Save'}
  </button>
);
```

## Configuration Details

### Query Client Settings
- **staleTime**: 1000 * 60 * 5 (5 minutes)
  - Data is considered fresh for 5 minutes
  - After stale, background refetch occurs on next use
  
- **gcTime**: 1000 * 60 * 10 (10 minutes)
  - Unused data is garbage collected after 10 minutes
  - Reduces memory consumption
  
- **retry**: 1
  - Failed queries retry once automatically
  - Configurable per hook if needed
  
- **refetchOnWindowFocus**: false
  - Prevents excessive refetching when window regains focus
  - Can be overridden per query

### Exam Attempt Cache Strategy
- Shorter stale time (1 minute) for exam attempts
- Ensures fresh question data during exams
- Live exams refresh every 2 minutes
- Upcoming exams refresh every 5 minutes

## Performance Impact

1. **Reduced Network Calls**: Caching eliminates duplicate requests
2. **Improved App Responsiveness**: Instant data display from cache
3. **Background Updates**: Data stays fresh without blocking UI
4. **Reduced Backend Load**: Fewer redundant API calls

## Future Enhancements

1. **React Query DevTools**: Add `@tanstack/react-query-devtools` for debugging
2. **Pagination**: Implement infinite queries for large data sets
3. **Optimistic Updates**: Update UI before server confirmation
4. **Polling**: Add automatic refetch intervals for real-time data
5. **Prefetching**: Prefetch data on hover or route anticipation

## Migration Notes

All pages have been successfully migrated from manual fetch/apiFetch calls to React Query hooks. The old `apiFetch` function is still available for legacy code but should not be used in new components.

### Removed from Components
- Direct `apiFetch` calls in components
- Manual loading state management for queries
- Manual error handling in try-catch blocks
- useEffect-based data fetching patterns

### Benefits Over Previous Approach
- **Type-safe**: Better TypeScript support
- **Testable**: Easier to mock and test
- **Maintainable**: Centralized data fetching logic
- **Performant**: Built-in optimization
- **Scalable**: Easier to add new features like pagination
