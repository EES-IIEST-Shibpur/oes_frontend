# AptiCrack - Online Examination System

> A modern, full-featured web application for conducting aptitude tests and online examinations. Built with Next.js 16, React 19, and powered by a RESTful backend API.

## Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [Technology Stack](#technology-stack)
- [Architecture & Flow](#architecture--flow)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Application Flow](#application-flow)
- [API Integration](#api-integration)
- [Authentication System](#authentication-system)
- [Key Components](#key-components)
- [Configuration](#configuration)
- [Development](#development)

---

## Overview

AptiCrack is a comprehensive online examination platform designed for students preparing for placement tests. The platform provides a realistic exam environment with features like timed tests, multiple question types, real-time answer saving, and detailed performance analytics.

### Key Highlights

- Real-time exam interface with automatic submission
- Multi-type question support (Single correct, Multiple correct, Numerical)
- JWT-based secure authentication with email verification
- Responsive design optimized for desktop, tablet, and mobile devices
- Live and upcoming exam management
- Profile management with academic details
- Skeleton loaders for improved UX

---

## Core Features

### User Management
- Secure registration with email verification
- OTP-based verification system
- JWT token authentication
- Profile management with academic information
- Password-protected login

### Examination System
- Live exam tracking
- Upcoming exam visibility
- Dynamic question loading
- Multiple question types support
- Real-time answer saving
- Timer-based auto-submission
- Progress tracking (answered/unanswered)
- Navigation between questions
- Clear answer functionality

### Dashboard
- Welcome screen with user stats
- Live exams display with metadata
- Upcoming exams preview
- Quick access to profile and logout

---

## Technology Stack

### Core Framework
```
Next.js         16.1.1    - React framework with App Router
React           19.2.3    - UI library
React DOM       19.2.3    - React rendering
```

### Development Tools
```
ESLint          ^9        - Code quality and linting
React Compiler  1.0.0     - Performance optimization
```

### Styling
```
CSS Modules               - Component-scoped styling
```

---

## Architecture & Flow

### Application Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser Client                        │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐   │
│  │          Next.js App Router (React)              │   │
│  │  ├─ Pages (Client Components)                    │   │
│  │  ├─ Components (Reusable UI)                     │   │
│  │  ├─ CSS Modules (Styling)                        │   │
│  │  └─ API Client (lib/api.js)                      │   │
│  └──────────────────────────────────────────────────┘   │
│                         │                                │
│                         ▼                                │
│                  localStorage                            │
│                  (JWT Token)                             │
└─────────────────────────────────────────────────────────┘
                          │
                  HTTP/JSON API
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Backend API Server                          │
│           (http://localhost:8000)                        │
│                                                           │
│  ├─ /api/auth/*          Authentication                  │
│  ├─ /api/profile/*       User Profile                    │
│  ├─ /api/exam/*          Exam Management                 │
│  └─ /api/exam-attempt/*  Exam Sessions                   │
└─────────────────────────────────────────────────────────┘
```

### Request Flow

1. **Client Request** → User interacts with UI component
2. **API Client** → `apiFetch()` function prepares request
3. **Token Injection** → JWT token automatically added from localStorage
4. **HTTP Request** → Sent to backend API endpoint
5. **Response Handling** → Status code and data processing
6. **Auth Check** → 401/403 redirects to login
7. **State Update** → React state updated with response data
8. **UI Render** → Component re-renders with new data

---

## Installation

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Running backend API server

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd oes-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
   
   Create `.env.local` in the root directory:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access application**
   
   Open browser at `http://localhost:3000`

### Available Scripts

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint checks
```

---

## Project Structure

```
oes-frontend/
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.js                 # Root layout component
│   │   ├── page.js                   # Landing page (/)
│   │   ├── home.module.css           # Landing page styles
│   │   │
│   │   ├── login/                    # Login page
│   │   │   ├── page.js               # Login component
│   │   │   └── login.module.css      # Login styles
│   │   │
│   │   ├── signup/                   # Registration page
│   │   │   ├── page.js               # Signup component
│   │   │   └── signup.module.css     # Signup styles
│   │   │
│   │   ├── verify-email/             # Email verification
│   │   │   └── page.js               # Email verify component
│   │   │
│   │   ├── verify-otp/               # OTP verification
│   │   │   ├── page.js               # OTP verify component
│   │   │   └── verify-otp.module.css # OTP styles
│   │   │
│   │   ├── dashboard/                # Main dashboard
│   │   │   ├── page.js               # Dashboard component
│   │   │   └── dashboard.module.css  # Dashboard styles
│   │   │
│   │   ├── profile/                  # User profile
│   │   │   ├── page.js               # Profile component
│   │   │   └── profile.module.css    # Profile styles
│   │   │
│   │   └── exam/                     # Exam module
│   │       └── [examId]/             # Dynamic exam route
│   │           ├── page.js           # Exam interface
│   │           └── exam.module.css   # Exam styles
│   │
│   ├── components/                   # Reusable components
│   │   └── skeletons/
│   │       └── LiveExamSkeleton.js   # Loading skeleton
│   │
│   └── lib/                          # Utility libraries
│       └── api.js                    # API client utility
│
├── public/                           # Static assets
├── next.config.mjs                   # Next.js configuration
├── eslint.config.mjs                 # ESLint configuration
├── jsconfig.json                     # JavaScript config
├── package.json                      # Dependencies
└── README.md                         # Documentation
```

---

## Application Flow

### 1. User Registration Flow

```
START → Signup Page
  │
  ├─ User enters: fullName, email, password
  │
  ├─ POST /api/auth/signup
  │    └─ Success: Display verification message
  │    └─ Error: Show error message
  │
  ├─ Verification email sent to user
  │
  ├─ User clicks verification link
  │    └─ Redirects to /verify-email?token=xxx
  │
  ├─ POST /api/auth/verify-email/:token
  │    └─ Success: Redirect to /login
  │    └─ Error: Show error with resend option
  │
END → Login Page
```

### 2. User Login Flow

```
START → Login Page
  │
  ├─ Check localStorage for existing token
  │    └─ If exists: Redirect to /dashboard
  │
  ├─ User enters: email, password
  │
  ├─ POST /api/auth/login
  │    └─ Response: { accessToken, user }
  │
  ├─ Store token in localStorage
  │
  ├─ Redirect to /dashboard
  │
END
```

### 3. Dashboard Flow

```
START → Dashboard Page
  │
  ├─ Parallel API Calls:
  │    ├─ GET /api/profile/me          → User details
  │    ├─ GET /api/exam/live           → Live exams
  │    └─ GET /api/exam/upcoming       → Upcoming exams
  │
  ├─ Display welcome message with user name
  │
  ├─ Show statistics:
  │    ├─ Live exams count
  │    └─ Upcoming exams count
  │
  ├─ Render exam cards with:
  │    ├─ Exam title
  │    ├─ Duration
  │    ├─ Total questions
  │    └─ Start button
  │
  ├─ User actions:
  │    ├─ Profile button → Navigate to /profile
  │    ├─ Logout button → Clear token, redirect to /login
  │    └─ Start Exam button → Confirm dialog → POST /api/exam-attempt/:id/start
  │
END
```

### 4. Exam Taking Flow

```
START → Exam Page (/exam/[examId])
  │
  ├─ GET /api/exam-attempt/:examId/attempt
  │    └─ Response: { exam, questions, remainingSeconds }
  │
  ├─ Initialize state:
  │    ├─ Load all questions
  │    ├─ Set remaining time
  │    ├─ Load saved answers (if any)
  │    └─ Set current question index to 0
  │
  ├─ Start countdown timer
  │    └─ Update every second
  │    └─ Auto-submit when time = 0
  │
  ├─ Display current question:
  │    ├─ Question statement
  │    ├─ Question type (SINGLE_CORRECT | MULTIPLE_CORRECT | NUMERICAL)
  │    └─ Options (if applicable)
  │
  ├─ User interactions:
  │    ├─ Select option(s)
  │    │    └─ Update local state (unsaved)
  │    │
  │    ├─ Enter numerical answer
  │    │    └─ Update local state (unsaved)
  │    │
  │    ├─ Clear Answer
  │    │    └─ Remove answer from state
  │    │
  │    ├─ Previous button
  │    │    └─ Navigate to previous question
  │    │
  │    ├─ Save & Next button
  │    │    ├─ POST /api/exam-attempt/:examId/save
  │    │    │    └─ Body: { questionId, selectedOptionIds/numericalAnswer }
  │    │    └─ Navigate to next question
  │    │
  │    └─ Submit button
  │         ├─ Confirmation dialog
  │         ├─ POST /api/exam-attempt/:examId/submit
  │         └─ Redirect to /dashboard
  │
  ├─ Timer reaches 0
  │    ├─ POST /api/exam-attempt/:examId/submit (auto)
  │    └─ Redirect to /dashboard
  │
END
```

### 5. Profile Management Flow

```
START → Profile Page
  │
  ├─ GET /api/profile/me
  │    └─ Load user profile data
  │
  ├─ Display profile information:
  │    ├─ Full Name
  │    ├─ Email (read-only)
  │    ├─ Course (B.Tech, M.Tech, etc.)
  │    ├─ Department
  │    ├─ Year
  │    ├─ Semester
  │    └─ Enrollment Number
  │
  ├─ Edit mode:
  │    ├─ Enable form fields
  │    ├─ User modifies data
  │    ├─ PUT /api/profile/update
  │    └─ Display success/error message
  │
END
```

---

## API Integration

### API Client (`src/lib/api.js`)

The application uses a centralized API client that handles all HTTP communications.

#### Features

- **Automatic token injection** from localStorage
- **Base URL configuration** via environment variable
- **Error handling** with automatic redirects on 401/403
- **JSON serialization** for request/response bodies
- **Flexible request options** (method, headers, body)

#### Function Signature

```javascript
apiFetch(path, options) => Promise<{ status, data, ok }>
```

#### Usage Examples

```javascript
// GET request
const response = await apiFetch('/api/exam/live');

// POST request with body
const response = await apiFetch('/api/auth/login', {
  method: 'POST',
  body: { email, password }
});

// PUT request with custom headers
const response = await apiFetch('/api/profile/update', {
  method: 'PUT',
  body: profileData,
  headers: { 'X-Custom-Header': 'value' }
});
```

#### Response Structure

```javascript
{
  status: 200,              // HTTP status code
  data: { ... },            // Parsed JSON response
  ok: true                  // Boolean indicating success
}
```

### API Endpoints

#### Authentication
```
POST   /api/auth/signup               Register new user
POST   /api/auth/login                Authenticate user
POST   /api/auth/verify-email/:token  Verify email address
POST   /api/verify-otp                Verify OTP code
POST   /api/resend-otp                Resend OTP
```

#### Profile
```
GET    /api/profile/me                Get user profile
PUT    /api/profile/update            Update user profile
```

#### Exams
```
GET    /api/exam/live                 Get live exams
GET    /api/exam/upcoming             Get upcoming exams
```

#### Exam Attempts
```
POST   /api/exam-attempt/:id/start    Start exam attempt
GET    /api/exam-attempt/:id/attempt  Get exam questions
POST   /api/exam-attempt/:id/save     Save answer
POST   /api/exam-attempt/:id/submit   Submit exam
```

---

## Authentication System

### Token-Based Authentication

The application implements JWT (JSON Web Token) authentication:

#### Storage
- Tokens stored in `localStorage` with key `"token"`
- Persists across browser sessions
- Automatically included in API requests

#### Flow
```
Login → Receive JWT → Store in localStorage → Include in requests → Automatic validation
```

#### Automatic Logout
- 401 (Unauthorized) or 403 (Forbidden) responses trigger:
  - Token removal from localStorage
  - Redirect to login page
  - Implemented in `apiFetch()` utility

#### Protected Routes
- All routes except `/`, `/login`, `/signup`, `/verify-email`, `/verify-otp` require authentication
- Client-side check via `useEffect` hook
- Redirects to dashboard if already authenticated

---

## Key Components

### Page Components

#### Landing Page (`src/app/page.js`)
- Brand name: "AptiCrack"
- Hero section with call-to-action buttons
- Feature showcase (6 feature cards)
- Statistics display
- Login/Signup navigation

#### Login Page (`src/app/login/page.js`)
- Email and password inputs
- Client-side validation
- Error message display
- Link to signup page
- Auto-redirect if already logged in

#### Signup Page (`src/app/signup/page.js`)
- Full name, email, password inputs
- Success message with verification instructions
- Error handling
- Link to login page

#### Dashboard (`src/app/dashboard/page.js`)
- Top navigation bar with profile and logout
- Welcome section with user greeting
- Statistics cards (live/upcoming exams)
- Live exams grid with start buttons
- Upcoming exams list
- Empty states for no exams

#### Exam Interface (`src/app/exam/[examId]/page.js`)
- Dynamic route parameter (examId)
- Timer display with auto-submit
- Question navigation
- Question rendering by type:
  - Single correct: Radio buttons
  - Multiple correct: Checkboxes
  - Numerical: Number input
- Answer persistence
- Save & Next functionality
- Submit confirmation dialog

#### Profile Page (`src/app/profile/page.js`)
- User information display
- Edit mode toggle
- Form validation
- Academic details:
  - Course selection
  - Department selection
  - Year and semester
  - Enrollment number
- Save functionality

### Reusable Components

#### LiveExamSkeleton (`src/components/skeletons/LiveExamSkeleton.js`)
- Loading placeholder for exam cards
- Displays 3 skeleton cards
- Matches exam card structure
- Improves perceived performance

---

## Configuration

### Environment Variables

Create `.env.local` file in root:

```env
# Backend API base URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### Next.js Configuration (`next.config.mjs`)

Standard Next.js configuration for React 19 and compiler features.

### ESLint Configuration (`eslint.config.mjs`)

Extends Next.js recommended ESLint rules for code quality.

---

## Development

### Development Workflow

1. **Start backend server** (ensure running on port 8000)
2. **Start frontend dev server**
   ```bash
   npm run dev
   ```
3. **Access application** at `http://localhost:3000`
4. **Make changes** - Hot reload enabled
5. **Run linter**
   ```bash
   npm run lint
   ```

### Production Build

```bash
npm run build    # Creates optimized production build
npm start        # Serves production build
```

### Code Style

- **Components**: Client components with `"use client"` directive
- **Styling**: CSS Modules for scoped styles
- **State Management**: React hooks (useState, useEffect, useRef)
- **Navigation**: Next.js App Router with `useRouter` and `useParams`
- **API Calls**: Centralized through `apiFetch()` utility

### Browser Support

- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile responsive design

---

## Project Metadata

**Application Name**: AptiCrack  
**Version**: 0.1.0  
**Type**: College Mini Project  
**Framework**: Next.js 16 with React 19  
**License**: Private

---

## Support & Contribution

For issues, feature requests, or contributions, please contact the development team or refer to the project repository.

---

**Last Updated**: January 2026

