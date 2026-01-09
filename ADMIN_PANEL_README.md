# Admin Panel Frontend Documentation

## Overview

This is a comprehensive Admin Panel for the Online Examination System (OES-Frontend). It provides administrators with tools to manage questions, create and publish exams, and monitor the system.

## Features

### 1. Authentication
- **Admin Login** (`/admin/login`)
  - Email-based authentication
  - Bearer Token stored in localStorage
  - Automatic redirect to dashboard on successful login
  - Protected routes with automatic redirect to login for unauthenticated users

### 2. Admin Dashboard
- **Route**: `/admin/dashboard`
- Overview of system statistics
- Quick action buttons for common tasks
- Navigation to manage questions and exams

### 3. Manage Questions
- **Route**: `/admin/questions`
- **Features**:
  - View all questions with pagination
  - Search and filter by domain
  - Create new questions
  - Edit existing questions
  - Delete questions
  - Support for two question types:
    - **MULTIPLE_CORRECT**: Multiple choice questions with multiple correct answers
    - **NUMERICAL**: Questions with numerical answers

#### Question Creation/Editing
- **Route**: `/admin/questions/create` (Create)
- **Route**: `/admin/questions/[questionId]` (Edit)
- **Features**:
  - Question statement input
  - Domain selection (with custom domain support)
  - Difficulty level (EASY, MEDIUM, HARD)
  - Dynamic option management for MULTIPLE_CORRECT questions
  - Numerical answer input for NUMERICAL questions
  - Form validation before submission

### 4. Manage Exams
- **Route**: `/admin/exams`
- **Features**:
  - View all exams in card layout
  - Search exams by title
  - Create new exams
  - View exam details
  - Edit exam details (before publishing)
  - Add questions to exams
  - Publish exams
  - Delete exams
  - Status indicators (Draft/Published)

#### Exam Creation
- **Route**: `/admin/exams/create`
- **Features**:
  - Exam title and description
  - Duration in minutes
  - Start and end time scheduling
  - Form validation

#### Exam Details/Editing
- **Route**: `/admin/exams/[examId]`
- View all questions in the exam
- Remove questions (before publishing)
- Edit exam details (before publishing)
- Publish exam
- Delete exam

#### Add Questions to Exam
- **Route**: `/admin/exams/[examId]/add-questions`
- Browse and select questions from question bank
- Filter by domain and search
- Multi-select questions
- Add to exam with single request

## Project Structure

```
src/
├── app/
│   └── admin/
│       ├── login/
│       │   ├── page.js (Login page)
│       │   └── login.module.css
│       ├── dashboard/
│       │   ├── page.js (Dashboard)
│       │   └── dashboard.module.css
│       ├── questions/
│       │   ├── page.js (Questions list)
│       │   ├── questions.module.css
│       │   ├── create/
│       │   │   └── page.js (Create question)
│       │   ├── [questionId]/
│       │   │   └── page.js (Edit question)
│       │   └── form.module.css
│       └── exams/
│           ├── page.js (Exams list)
│           ├── exams.module.css
│           ├── create/
│           │   └── page.js (Create exam)
│           ├── examForm.module.css
│           ├── [examId]/
│           │   ├── page.js (Exam details)
│           │   ├── examDetails.module.css
│           │   ├── edit/
│           │   │   └── page.js (Edit exam)
│           │   └── add-questions/
│           │       ├── page.js (Add questions)
│           │       └── addQuestions.module.css
│       ├── admin.global.css (Global styles)
│       └── AdminLayout.js
├── components/
│   └── admin/
│       ├── ProtectedAdminRoute.js (Route protection)
│       ├── AdminLayout.js (Layout wrapper)
│       └── AdminLayout.module.css
├── context/
│   └── AdminAuthContext.js (Auth context provider)
├── hooks/
│   ├── useAdminAuth.js (Auth hook)
│   └── useAdminApi.js (API hook with Bearer token)
└── lib/
    └── api.js (Existing API utility)
```

## How to Use

### Setup

1. **Install Dependencies** (if not already done)
```bash
npm install
```

2. **Environment Variables**
Ensure you have the backend URL configured in your environment:
```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

3. **Start Development Server**
```bash
npm run dev
```

Visit `http://localhost:3000/admin/login` to access the admin panel.

### Authentication Flow

1. Admin visits `/admin/login`
2. Enters email and password
3. Frontend sends POST request to `/api/auth/login`
4. Backend returns access token
5. Token is stored in localStorage
6. Admin is redirected to `/admin/dashboard`
7. All API requests include Bearer token in Authorization header
8. If token expires (401/403), user is redirected to login

### API Integration

The admin panel connects to the following backend endpoints:

#### Authentication
- `POST /api/auth/login` - Login with email and password

#### Questions
- `GET /api/question/all` - Get all questions
- `GET /api/question/:questionId` - Get specific question
- `POST /api/question/create` - Create new question
- `PUT /api/question/:questionId` - Update question
- `DELETE /api/question/:questionId` - Delete question

#### Exams
- `GET /api/exam/all` - Get all exams
- `GET /api/exam/:examId` - Get specific exam
- `POST /api/exam/create` - Create new exam
- `PUT /api/exam/:examId/update` - Update exam (before publishing)
- `POST /api/exam/:examId/questions` - Add questions to exam
- `DELETE /api/exam/:examId/questions/:questionId` - Remove question from exam
- `POST /api/exam/:examId/publish` - Publish exam
- `DELETE /api/exam/:examId` - Delete exam

## Component Details

### AdminAuthContext
Manages authentication state globally. Stores admin data and token in localStorage.

**Usage**:
```javascript
const { admin, isAuthenticated, login, logout, isLoading } = useAdminAuth();
```

### useAdminApi Hook
Handles API requests with automatic Bearer token injection and error handling.

**Usage**:
```javascript
const { apiFetch, admin } = useAdminApi();
const response = await apiFetch('/api/exam/all');
```

### ProtectedAdminRoute
HOC wrapper that ensures route is only accessible to authenticated admins. Redirects to login if not authenticated.

### AdminLayout
Main layout wrapper with sidebar navigation, user info, and logout button.

## Styling

- Uses CSS Modules for component-scoped styling
- Global admin styles in `admin.global.css`
- Color scheme:
  - Primary: #2563eb (Blue)
  - Success: #16a34a (Green)
  - Danger: #dc2626 (Red)
  - Warning: #f59e0b (Orange)
- Responsive design supporting mobile, tablet, and desktop

## Form Validation

### Questions
- Statement is required
- Domain is required
- For MULTIPLE_CORRECT:
  - Minimum 2 options required
  - At least 1 correct answer required
  - All options must have text
- For NUMERICAL:
  - Numerical answer is required

### Exams
- Title is required
- Description is required
- Duration must be valid positive number
- Start time is required
- End time is required
- End time must be after start time

## State Management

- **Authentication**: Context API (AdminAuthContext)
- **Form State**: React useState
- **API State**: useState for loading, error, and success states
- **Local Storage**: Token and admin data persistence

## Security Features

- Bearer token authentication
- Protected routes with auth checks
- Automatic logout on 401/403 errors
- Token stored only in localStorage (NOT in cookies for simplicity)
- All admin API calls require valid token

## Browser Support

- Modern browsers supporting ES6+
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Admin not redirecting to login
- Clear localStorage: `localStorage.clear()`
- Check if token has expired
- Verify backend is returning valid tokens

### Questions not loading
- Check network tab for API errors
- Verify backend is running and accessible
- Check if token is valid (401 response means expired)

### Form submission failing
- Check browser console for error messages
- Verify all required fields are filled
- Check form validation errors displayed on page

## Future Enhancements

1. Add pagination for questions and exams
2. Bulk question import from CSV
3. Exam analytics and statistics
4. Question tagging and categorization
5. Admin user management
6. Audit logging
7. Export functionality for reports
8. Advanced search and filtering

## Support

For issues or questions, please check:
1. Browser console for JavaScript errors
2. Network tab for API responses
3. Backend API documentation
4. Form validation messages
