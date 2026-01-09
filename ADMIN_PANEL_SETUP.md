# Admin Panel Setup Guide

## Quick Start

### 1. Installation
No additional packages need to be installed. The admin panel uses Next.js 16, React 19, and CSS Modules which are already configured.

### 2. Environment Configuration
Ensure your `.env.local` file has:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### 3. Start the Application
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Accessing the Admin Panel

1. Go to `http://localhost:3000/admin/login`
2. Login with admin credentials
3. You'll be redirected to the admin dashboard

## File Organization

### Authentication & Context
- **`src/context/AdminAuthContext.js`** - Global auth state management
- **`src/hooks/useAdminAuth.js`** - Hook to access auth context
- **`src/hooks/useAdminApi.js`** - Hook for authenticated API calls
- **`src/components/admin/ProtectedAdminRoute.js`** - Route protection wrapper

### Layouts & Components
- **`src/components/admin/AdminLayout.js`** - Main admin layout with sidebar
- **`src/components/admin/AdminLayout.module.css`** - Sidebar styling

### Pages

#### Admin Panel Root
- **`src/app/admin/admin.global.css`** - Global styles for entire admin section
- **`src/app/admin/login/page.js`** - Login page
- **`src/app/admin/login/login.module.css`** - Login page styles

#### Dashboard
- **`src/app/admin/dashboard/page.js`** - Admin dashboard
- **`src/app/admin/dashboard/dashboard.module.css`** - Dashboard styles

#### Questions Management
- **`src/app/admin/questions/page.js`** - Questions list with CRUD operations
- **`src/app/admin/questions/questions.module.css`** - Questions list styles
- **`src/app/admin/questions/form.module.css`** - Question form styles
- **`src/app/admin/questions/create/page.js`** - Create question page
- **`src/app/admin/questions/[questionId]/page.js`** - Edit question page

#### Exams Management
- **`src/app/admin/exams/page.js`** - Exams list with CRUD operations
- **`src/app/admin/exams/exams.module.css`** - Exams list styles
- **`src/app/admin/exams/examForm.module.css`** - Exam form styles
- **`src/app/admin/exams/create/page.js`** - Create exam page
- **`src/app/admin/exams/[examId]/page.js`** - Exam details page
- **`src/app/admin/exams/[examId]/examDetails.module.css`** - Exam details styles
- **`src/app/admin/exams/[examId]/edit/page.js`** - Edit exam page
- **`src/app/admin/exams/[examId]/add-questions/page.js`** - Add questions to exam page
- **`src/app/admin/exams/[examId]/addQuestions.module.css`** - Add questions styles

## Backend API Requirements

### Questions Endpoint
Create question payload:
```json
{
  "statement": "Which of the following are valid HTTP request methods?",
  "questionType": "MULTIPLE_CORRECT",
  "domain": "Web Development",
  "difficulty": "EASY",
  "options": [
    { "text": "GET", "isCorrect": true },
    { "text": "POST", "isCorrect": true },
    { "text": "FETCH", "isCorrect": false },
    { "text": "DELETE", "isCorrect": true }
  ]
}
```

Or for numerical questions:
```json
{
  "statement": "What is 2 + 2?",
  "questionType": "NUMERICAL",
  "domain": "Mathematics",
  "difficulty": "EASY",
  "numericalAnswer": 4
}
```

### Exams Endpoint
Create exam payload:
```json
{
  "title": "PwC Intern Online Assessment",
  "description": "No Cheating",
  "durationMinutes": 90,
  "startTime": "2026-01-08T00:05",
  "endTime": "2026-01-08T02:05"
}
```

Add questions payload:
```json
{
  "addQuestionIds": [
    { "questionId": "00cd94dd-e207-4a37-b594-29059665395b" },
    { "questionId": "b7f64f03-d215-4f02-8981-0c61518be685" }
  ]
}
```

## Features Implemented

### ✅ Authentication
- Admin login with email and password
- Bearer token authentication
- Protected routes with automatic redirects
- Session persistence with localStorage

### ✅ Dashboard
- System statistics overview
- Quick action buttons
- Navigation to manage sections

### ✅ Questions Management
- **View**: List all questions with pagination and filtering
- **Create**: Add new questions (MULTIPLE_CORRECT or NUMERICAL)
- **Read**: View question details
- **Update**: Edit existing questions
- **Delete**: Remove questions
- **Search**: By statement content
- **Filter**: By domain

### ✅ Exams Management
- **View**: List all exams with status indicators
- **Create**: Create new exams with scheduling
- **Read**: View exam details with associated questions
- **Update**: Edit exam details (before publishing)
- **Delete**: Remove exams
- **Publish**: Lock exam and prevent further edits
- **Add Questions**: Select and add multiple questions to exams
- **Remove Questions**: Remove questions from exams (before publishing)
- **Search**: By exam title

### ✅ Form Validation
- Client-side validation for all forms
- Real-time error messages
- Prevent invalid submissions

### ✅ UI/UX
- Responsive design (mobile, tablet, desktop)
- Loading states with spinners
- Success/error messages
- Intuitive navigation
- Professional styling with color scheme

## Testing the Admin Panel

### Test Workflow
1. **Login**: Go to `/admin/login` and login with test credentials
2. **View Dashboard**: Check `/admin/dashboard` for overview
3. **Create Question**: Navigate to `/admin/questions` → Create Question
4. **View Questions**: Check the questions list with search/filter
5. **Edit Question**: Click Edit on any question
6. **Create Exam**: Go to `/admin/exams` → Create Exam
7. **View Exam Details**: Click View Details on any exam
8. **Add Questions**: Click Add Questions and select from the list
9. **Edit Exam**: Click Edit to modify exam details (only if not published)
10. **Publish Exam**: Click Publish to finalize the exam
11. **Logout**: Click logout button in sidebar footer

## Common Issues & Solutions

### Issue: Token not being sent with requests
**Solution**: Check that `localStorage.getItem('adminToken')` returns a valid token. Clear localStorage and re-login if needed.

### Issue: Redirect loop on login
**Solution**: Ensure backend `/api/auth/login` returns a valid token in the response.

### Issue: Protected routes not working
**Solution**: Verify `AdminAuthContext` is wrapped around the entire app in the root layout.

### Issue: API 404 errors
**Solution**: Check that `NEXT_PUBLIC_BACKEND_URL` is correctly set to your backend URL.

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Start production server:
```bash
npm run start
```

3. Set environment variables on your hosting platform

## Performance Tips

1. The admin panel uses Next.js automatic code splitting
2. CSS modules ensure minimal CSS overhead
3. Images are optimized with Next.js Image component (when added)
4. API requests are debounced where applicable

## Security Notes

- Tokens are stored in localStorage (suitable for admin panel)
- CSRF protection should be handled by backend
- XSS protection through React's built-in sanitization
- All API calls require Bearer token authentication
- Consider HTTPS in production

## Next Steps

1. Set up the backend API endpoints as specified
2. Configure environment variables
3. Test all admin features thoroughly
4. Consider adding additional features like:
   - Exam analytics
   - Bulk question import
   - Advanced search
   - User management

For more details, see `ADMIN_PANEL_README.md`
