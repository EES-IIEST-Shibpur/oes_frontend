# Admin Panel - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Start the Application
```bash
cd oes-frontend
npm run dev
```

### Step 2: Access Admin Panel
Open your browser and go to:
```
http://localhost:3000/admin/login
```

### Step 3: Login
Use your admin credentials to login.

---

## 📱 What You Can Do

### Manage Questions
1. Go to **Manage Questions** from the sidebar
2. Click **"+ Create Question"**
3. Choose question type:
   - **Multiple Correct**: For MC questions with multiple answers
   - **Numerical**: For questions requiring numerical answers
4. Fill in the details and click **"Create Question"**

**Features:**
- ✅ Search questions by text
- ✅ Filter by domain
- ✅ Edit existing questions
- ✅ Delete questions
- ✅ Pagination for large lists

### Manage Exams
1. Go to **Manage Exams** from the sidebar
2. Click **"+ Create Exam"**
3. Fill in exam details (title, description, duration, schedule)
4. Click **"Create Exam"**

**Features:**
- ✅ View all exams
- ✅ Search by title
- ✅ View exam details
- ✅ Add questions to exams
- ✅ Edit exam details
- ✅ Publish exams
- ✅ Delete exams

### Add Questions to Exam
1. Navigate to an exam's details page
2. Click **"+ Add Questions"**
3. Browse the question bank
4. Click **"+ Select"** on questions you want to add
5. Click **"Add X Questions"** when ready

### Publish Exam
1. Navigate to an exam's details page
2. Click **"Publish Exam"**
3. Confirm the action
4. Exam is now locked and published

**Note:** Published exams cannot be edited or have questions added/removed.

---

## 🎯 Common Workflows

### Creating a Complete Exam
1. **Create Questions First**
   - Go to `/admin/questions`
   - Create 10-20 questions covering different topics
   - Mix difficulty levels (EASY, MEDIUM, HARD)

2. **Create the Exam**
   - Go to `/admin/exams`
   - Click "Create Exam"
   - Fill in title, description, duration
   - Set start and end times

3. **Add Questions**
   - Open the exam details
   - Click "Add Questions"
   - Select relevant questions from the bank
   - Click "Add Questions"

4. **Review & Publish**
   - Review all exam details
   - Check all questions are correct
   - Click "Publish Exam"
   - Exam is now live!

---

## 🔑 Keyboard Shortcuts & Tips

### Navigation
- Use the sidebar to quickly jump between sections
- Click "Dashboard" to see system overview

### Forms
- All required fields are marked with *
- Press Tab to navigate between fields
- Forms validate before submission

### Search & Filter
- Type in search boxes for instant filtering
- Clear filters to see all items
- Use domain filter for targeted results

---

## 🎨 UI Guide

### Color-Coded Elements

**Blue (#2563eb)** - Primary actions, links
- View Details, Add Questions, etc.

**Green (#16a34a)** - Success, Create actions
- Create buttons, success messages

**Red (#dc2626)** - Delete, Remove actions
- Delete buttons, error messages

**Orange (#f59e0b)** - Edit actions
- Edit buttons

**Status Badges**
- 🟢 **Published** (Green) - Exam is live and locked
- 🔵 **Draft** (Blue) - Exam can still be edited

---

## ⚠️ Important Rules

### Questions
- ✅ Can be edited anytime
- ✅ Can be deleted anytime
- ❌ Cannot delete if used in published exams (backend validation)

### Exams
- ✅ Can be edited **before** publishing
- ✅ Can add/remove questions **before** publishing
- ✅ Can be deleted anytime
- ❌ **Cannot edit** after publishing
- ❌ **Cannot add/remove questions** after publishing

### Publishing
- **Before Publishing**: Edit freely
- **After Publishing**: Read-only mode
- **No Undo**: Publishing is permanent

---

## 🐛 Troubleshooting

### "Not authenticated" error
- Your session expired
- Click logout and login again
- Clear localStorage if needed: `localStorage.clear()`

### Changes not saving
- Check browser console for errors
- Verify backend is running
- Check network tab in dev tools
- Ensure all required fields are filled

### Can't edit exam
- Check if exam is published
- Published exams cannot be edited
- Create a new exam instead

### Token expired
- Admin tokens may expire after some time
- Simply logout and login again
- Your session will be refreshed

---

## 📞 Need Help?

1. **Check Documentation**
   - `ADMIN_PANEL_README.md` - Full feature guide
   - `ADMIN_PANEL_API.md` - API reference
   - `ADMIN_PANEL_SETUP.md` - Setup instructions

2. **Check Browser Console**
   - Press F12 to open developer tools
   - Look for errors in Console tab
   - Check Network tab for API responses

3. **Verify Backend**
   - Ensure backend is running
   - Check API endpoints are working
   - Verify token authentication is configured

---

## ✅ Checklist for Your First Exam

- [ ] Login to admin panel
- [ ] Create 5 questions (mix of types)
- [ ] Create an exam
- [ ] Add the 5 questions to the exam
- [ ] Review exam details
- [ ] Publish the exam
- [ ] Verify exam appears as "Published"
- [ ] Try to edit (should be disabled)

---

## 🎉 You're Ready!

Start managing your Online Examination System with the admin panel. The interface is intuitive, so explore and experiment!

**Happy Examining! 📝**
