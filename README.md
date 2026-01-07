You are implementing the FRONTEND of an Online Examination System (OES)
using Next.js App Router and JavaScript (NOT TypeScript).

Follow ALL rules strictly.

====================================================
TECH STACK & CONSTRAINTS
====================================================
- Framework: Next.js (App Router)
- Language: JavaScript only
- Styling: minimal inline styles or basic CSS (no UI library unless already present)
- Auth: JWT Bearer token stored in localStorage
- Backend is already implemented — DO NOT invent APIs
- If a page/file already exists, EDIT it instead of creating duplicates

====================================================
ROUTING STRUCTURE
====================================================
/app
 ├── signup/page.js
 ├── verify-otp/page.js
 ├── login/page.js
 ├── dashboard/page.js
 ├── profile/page.js
 └── exam/[examId]/page.js

====================================================
AUTH HANDLING (GLOBAL RULE)
====================================================
- Every API call MUST include:
  Authorization: Bearer <token from localStorage>
- If any API returns 401 or 403:
  - Redirect user to /login
- Do NOT use server components for auth pages

====================================================
USER FLOW (STRICT)
====================================================
1. Signup → OTP Verification → Login
2. After login → redirect to Dashboard
3. Profile completion is OPTIONAL (NOT mandatory)
4. Exams can be attempted even if profile is incomplete
5. Profile is encouraged only for reporting purposes

====================================================
DASHBOARD PAGE BEHAVIOR
====================================================
- Fetch user info from GET /api/me
- Fetch exams from GET /api/exams
- Show:
  - Candidate Profile link
  - Live Exams
  - Upcoming Exams
- If profile is incomplete:
  - Show NON-BLOCKING warning/banner encouraging profile completion
  - MUST NOT block Start Exam button

START EXAM FLOW:
- On clicking Start Exam:
  1. Show confirmation dialog
  2. Call:
     POST /api/exam-attempt/:examId/start
  3. Backend returns { success, attemptId }
  4. Redirect to:
     /exam/:examId
- DO NOT fetch questions or time here

====================================================
PROFILE PAGE BEHAVIOR (/profile)
====================================================
- Fetch existing profile:
  GET /api/profile
- Allow user to edit:
  - fullName
  - course
  - department
  - year
  - semester
  - enrollmentNumber
- All fields required for saving
- Save using:
  POST /api/profile
- On success:
  - Show success message
  - Redirect to /dashboard
- Profile completion does NOT affect exam eligibility

====================================================
EXAM INTERFACE PAGE (/exam/[examId])
====================================================
ON PAGE LOAD (AND REFRESH):
- Call:
  GET /api/exam-attempt/:examId
- Response contains:
  - questions[]
  - remainingSeconds
  - savedAnswers[]
- Hydrate full frontend state from this response

STATE MANAGEMENT:
- questions
- currentQuestionIndex
- remainingSeconds (timer)
- answersMap (keyed by questionId)

TIMER:
- Start countdown from remainingSeconds
- Decrement every second
- When time reaches 0:
  - Auto-submit exam (NO confirmation)

QUESTION TYPES:
1. MCQ (single correct)
   - Radio buttons
   - Only one option selectable
   - Payload:
     selectedOptionIds: [optionId]

2. MCQ (multiple correct)
   - Checkboxes
   - Multiple selectable
   - Payload:
     selectedOptionIds: [optionId1, optionId2]

3. Numerical
   - Number input
   - Payload:
     numericalAnswer: number

QUESTION PANEL:
- Display all question numbers on RIGHT side
- Clicking a number navigates to that question
- Highlight current question

CLEAR ANSWER:
- Frontend-only action
- Clears UI selection/input
- Does NOT call backend
- Clearing is persisted ONLY when Save & Next is clicked

SAVE & NEXT:
- Call:
  POST /api/exam-attempt/:examId/save
- Payload rules:
  - MCQ cleared → selectedOptionIds: []
  - Numerical cleared → backend-accepted default
- On success:
  - Move to next question

SUBMIT EXAM:
- Manual submit:
  - Show confirmation modal
  - On confirm:
    POST /api/exam-attempt/:examId
- Auto submit:
  - Triggered by timer end
  - NO confirmation
- After submit:
  - Redirect to /dashboard

====================================================
IMPORTANT RULES
====================================================
- Exam must be refresh-safe
- Saved answers must restore on reload
- Do NOT block exams for profile completion
- Do NOT add backend logic or assumptions
- Keep UI minimal and exam-focused
- Prefer editing existing files over creating new ones

====================================================
GOAL
====================================================
Implement all pages and logic cleanly, predictably,
and strictly aligned with the backend APIs and flows above.