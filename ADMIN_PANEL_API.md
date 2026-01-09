# Admin Panel - API Integration Guide

## Overview
This document details all API endpoints required for the admin panel and the expected request/response formats.

## Base URL
```
http://localhost:8000
```
(Configure via `NEXT_PUBLIC_BACKEND_URL` environment variable)

## Authentication
All requests (except login) require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
Content-Type: application/json
```

---

## Authentication Endpoints

### 1. Admin Login
**Endpoint**: `POST /api/auth/login`

**Request**:
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response** (Success - 200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "admin-id-123",
    "email": "admin@example.com",
    "name": "Admin Name"
  }
}
```

**Response** (Error - 401):
```json
{
  "message": "Invalid email or password"
}
```

---

## Questions Endpoints

### 1. Get All Questions
**Endpoint**: `GET /api/question/all`

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "data": [
    {
      "_id": "question-id-1",
      "statement": "What is the capital of France?",
      "questionType": "MULTIPLE_CORRECT",
      "domain": "Geography",
      "difficulty": "EASY",
      "options": [
        { "text": "Paris", "isCorrect": true },
        { "text": "London", "isCorrect": false },
        { "text": "Berlin", "isCorrect": false }
      ],
      "createdAt": "2026-01-09T10:00:00Z"
    }
  ]
}
```

### 2. Get Question by ID
**Endpoint**: `GET /api/question/:questionId`

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "data": {
    "_id": "question-id-1",
    "statement": "What is the capital of France?",
    "questionType": "MULTIPLE_CORRECT",
    "domain": "Geography",
    "difficulty": "EASY",
    "options": [
      { "text": "Paris", "isCorrect": true },
      { "text": "London", "isCorrect": false },
      { "text": "Berlin", "isCorrect": false }
    ]
  }
}
```

### 3. Create Question
**Endpoint**: `POST /api/question/create`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request** (MULTIPLE_CORRECT):
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

**Request** (NUMERICAL):
```json
{
  "statement": "What is 2 + 2?",
  "questionType": "NUMERICAL",
  "domain": "Mathematics",
  "difficulty": "EASY",
  "numericalAnswer": 4
}
```

**Response** (201):
```json
{
  "data": {
    "_id": "question-id-new",
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
  },
  "message": "Question created successfully"
}
```

### 4. Update Question
**Endpoint**: `PUT /api/question/:questionId`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request**:
```json
{
  "statement": "Which of the following are valid HTTP request methods?",
  "questionType": "MULTIPLE_CORRECT",
  "domain": "Web Development",
  "difficulty": "MEDIUM",
  "options": [
    { "text": "GET", "isCorrect": true },
    { "text": "POST", "isCorrect": true },
    { "text": "FETCH", "isCorrect": false }
  ]
}
```

**Response** (200):
```json
{
  "data": {
    "_id": "question-id",
    "statement": "Which of the following are valid HTTP request methods?",
    "questionType": "MULTIPLE_CORRECT",
    "domain": "Web Development",
    "difficulty": "MEDIUM",
    "options": [
      { "text": "GET", "isCorrect": true },
      { "text": "POST", "isCorrect": true },
      { "text": "FETCH", "isCorrect": false }
    ]
  },
  "message": "Question updated successfully"
}
```

### 5. Delete Question
**Endpoint**: `DELETE /api/question/:questionId`

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "message": "Question deleted successfully"
}
```

---

## Exams Endpoints

### 1. Get All Exams
**Endpoint**: `GET /api/exam/all`

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "data": [
    {
      "_id": "exam-id-1",
      "title": "PwC Intern Online Assessment",
      "description": "No Cheating",
      "durationMinutes": 90,
      "startTime": "2026-01-08T00:05:00Z",
      "endTime": "2026-01-08T02:05:00Z",
      "isPublished": false,
      "questions": [
        {
          "_id": "question-id-1",
          "statement": "Question text...",
          "questionType": "MULTIPLE_CORRECT",
          "domain": "Web Development",
          "difficulty": "EASY"
        }
      ],
      "createdAt": "2026-01-09T10:00:00Z"
    }
  ]
}
```

### 2. Get Exam by ID
**Endpoint**: `GET /api/exam/:examId`

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "data": {
    "_id": "exam-id-1",
    "title": "PwC Intern Online Assessment",
    "description": "No Cheating",
    "durationMinutes": 90,
    "startTime": "2026-01-08T00:05:00Z",
    "endTime": "2026-01-08T02:05:00Z",
    "isPublished": false,
    "questions": [
      {
        "_id": "question-id-1",
        "statement": "Question text...",
        "questionType": "MULTIPLE_CORRECT",
        "domain": "Web Development",
        "difficulty": "EASY"
      }
    ]
  }
}
```

### 3. Create Exam
**Endpoint**: `POST /api/exam/create`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request**:
```json
{
  "title": "PwC Intern Online Assessment",
  "description": "No Cheating",
  "durationMinutes": 90,
  "startTime": "2026-01-08T00:05",
  "endTime": "2026-01-08T02:05"
}
```

**Response** (201):
```json
{
  "data": {
    "_id": "exam-id-new",
    "title": "PwC Intern Online Assessment",
    "description": "No Cheating",
    "durationMinutes": 90,
    "startTime": "2026-01-08T00:05:00Z",
    "endTime": "2026-01-08T02:05:00Z",
    "isPublished": false,
    "questions": []
  },
  "message": "Exam created successfully"
}
```

### 4. Update Exam
**Endpoint**: `PUT /api/exam/:examId/update`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request**:
```json
{
  "title": "PwC Intern Online Assessment - Updated",
  "description": "No Cheating - Strict Rules",
  "durationMinutes": 120,
  "startTime": "2026-01-08T00:05",
  "endTime": "2026-01-08T02:05"
}
```

**Response** (200):
```json
{
  "data": {
    "_id": "exam-id",
    "title": "PwC Intern Online Assessment - Updated",
    "description": "No Cheating - Strict Rules",
    "durationMinutes": 120,
    "startTime": "2026-01-08T00:05:00Z",
    "endTime": "2026-01-08T02:05:00Z",
    "isPublished": false,
    "questions": []
  },
  "message": "Exam updated successfully"
}
```

**Error** (400):
```json
{
  "message": "Cannot update published exam"
}
```

### 5. Add Questions to Exam
**Endpoint**: `POST /api/exam/:examId/questions`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request**:
```json
{
  "addQuestionIds": [
    { "questionId": "00cd94dd-e207-4a37-b594-29059665395b" },
    { "questionId": "b7f64f03-d215-4f02-8981-0c61518be685" },
    { "questionId": "0f10ce1e-d712-4324-8588-39a0abf53da0" }
  ]
}
```

**Response** (200):
```json
{
  "data": {
    "_id": "exam-id",
    "title": "PwC Intern Online Assessment",
    "questions": [
      {
        "_id": "00cd94dd-e207-4a37-b594-29059665395b",
        "statement": "Question 1...",
        "questionType": "MULTIPLE_CORRECT",
        "domain": "Web Development",
        "difficulty": "EASY"
      },
      {
        "_id": "b7f64f03-d215-4f02-8981-0c61518be685",
        "statement": "Question 2...",
        "questionType": "NUMERICAL",
        "domain": "Mathematics",
        "difficulty": "MEDIUM"
      }
    ]
  },
  "message": "Questions added successfully"
}
```

### 6. Remove Question from Exam
**Endpoint**: `DELETE /api/exam/:examId/questions/:questionId`

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "message": "Question removed from exam"
}
```

**Error** (400):
```json
{
  "message": "Cannot remove questions from published exam"
}
```

### 7. Publish Exam
**Endpoint**: `POST /api/exam/:examId/publish`

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "data": {
    "_id": "exam-id",
    "title": "PwC Intern Online Assessment",
    "isPublished": true,
    "questions": [...]
  },
  "message": "Exam published successfully"
}
```

**Error** (400):
```json
{
  "message": "Exam must have at least one question before publishing"
}
```

### 8. Delete Exam
**Endpoint**: `DELETE /api/exam/:examId`

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "message": "Exam deleted successfully"
}
```

---

## Error Handling

### Common Error Responses

**401 Unauthorized**:
```json
{
  "message": "Unauthorized - Invalid or expired token"
}
```

**403 Forbidden**:
```json
{
  "message": "Forbidden - You don't have permission"
}
```

**404 Not Found**:
```json
{
  "message": "Resource not found"
}
```

**400 Bad Request**:
```json
{
  "message": "Validation error or invalid request"
}
```

**500 Server Error**:
```json
{
  "message": "Internal server error"
}
```

---

## Data Types & Validation

### Question Fields
- **statement** (string, required): Question text (min 10 chars)
- **questionType** (string, required): "MULTIPLE_CORRECT" or "NUMERICAL"
- **domain** (string, required): Subject area (min 3 chars)
- **difficulty** (string, required): "EASY", "MEDIUM", or "HARD"
- **options** (array, for MULTIPLE_CORRECT): Array of {text: string, isCorrect: boolean}
- **numericalAnswer** (number, for NUMERICAL): The correct numerical answer

### Exam Fields
- **title** (string, required): Exam name (min 5 chars)
- **description** (string, required): Exam description (min 10 chars)
- **durationMinutes** (number, required): Duration in minutes (min 1)
- **startTime** (ISO 8601 datetime, required): When exam starts
- **endTime** (ISO 8601 datetime, required): When exam ends (must be after startTime)
- **isPublished** (boolean): Whether exam is published (read-only)
- **questions** (array): Associated questions (read-only)

---

## Integration Checklist

- [ ] Backend API endpoints implemented
- [ ] Bearer token authentication working
- [ ] All question endpoints functional
- [ ] All exam endpoints functional
- [ ] Error handling with proper HTTP status codes
- [ ] Response format matches documentation
- [ ] Validation on backend
- [ ] Token expiration and refresh (if applicable)
- [ ] CORS configured for frontend

---

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

### Get All Questions
```bash
curl -X GET http://localhost:8000/api/question/all \
  -H "Authorization: Bearer <token>"
```

### Create Question
```bash
curl -X POST http://localhost:8000/api/question/create \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "statement": "What is 2+2?",
    "questionType": "NUMERICAL",
    "domain": "Mathematics",
    "difficulty": "EASY",
    "numericalAnswer": 4
  }'
```

### Create Exam
```bash
curl -X POST http://localhost:8000/api/exam/create \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Exam",
    "description": "Test Description",
    "durationMinutes": 90,
    "startTime": "2026-01-08T00:05",
    "endTime": "2026-01-08T02:05"
  }'
```
