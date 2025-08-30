# Database Seeding Guide

This guide explains how to populate your JFK Medical Portal database with realistic test data for development and testing purposes.

## 🚀 Quick Start

### Option 1: Admin Page (Recommended)
1. Navigate to `/database-admin` in your portal
2. Log in as an admin user
3. Click "Seed Database" to populate with test data
4. Use "Clear Test Data" when finished testing

### Option 2: Browser Console
1. Open your browser's developer console
2. Run: `runSeed()` to populate the database
3. Run: `runClear()` to clear test data

## 📊 What Gets Created

### Users (9 total)
- **1 Admin**: Dr. Sarah Johnson (admin@jfk.edu)
- **3 Teachers**: 
  - Dr. Michael Chen (mchen@jfk.edu) - Internal Medicine
  - Dr. Emily Rodriguez (erodriguez@jfk.edu) - Surgery
  - Dr. James Wilson (jwilson@jfk.edu) - Pediatrics
- **5 Students**: 
  - Alex Thompson (athompson@jfk.edu)
  - Maria Garcia (mgarcia@jfk.edu)
  - David Kim (dkim@jfk.edu)
  - Sarah Williams (swilliams@jfk.edu)
  - Robert Brown (rbrown@jfk.edu)

### Courses (3 total)
1. **MED201 - Internal Medicine I** (4 credits)
   - Instructor: Dr. Michael Chen
   - Capacity: 30 students
   - Semester: Fall 2024

2. **SUR301 - General Surgery Fundamentals** (3 credits)
   - Instructor: Dr. Emily Rodriguez
   - Capacity: 25 students
   - Semester: Fall 2024

3. **PED202 - Pediatric Medicine** (4 credits)
   - Instructor: Dr. James Wilson
   - Capacity: 28 students
   - Semester: Fall 2024

### Assignments (8 total)
- **MED201**: Cardiovascular Case Study (HW), Midterm Exam, Clinical Skills Assessment (OSCE)
- **SUR301**: Surgical Technique Presentation, Preoperative Assessment Quiz, Final Project
- **PED202**: Child Development Case Study (HW), Pediatric Pharmacology Quiz

### Enrollments (11 total)
- All 5 students enrolled in MED201
- 3 students enrolled in SUR301
- 4 students enrolled in PED202

### Class Sessions (4 total)
- Cardiovascular System Overview (MED201)
- Respiratory System Examination (MED201)
- Surgical Instruments and Sterile Technique (SUR301)
- Pediatric Growth and Development (PED202)

### Announcements (3 total)
- Welcome to Fall Semester 2024
- Clinical Skills Lab Schedule Update
- Surgical Skills Lab Safety Reminder

### Sample Submissions (4 total)
- Cardiovascular Case Study submissions with grades and feedback
- Surgical Technique Presentation submission
- Child Development Case Study submission

## 🔐 Test Account Credentials

Since these are test accounts, you'll need to create Firebase Auth users manually or use the existing authentication system. The seeding script creates Firestore documents with these UIDs:

- **Admin**: `admin-001`
- **Teachers**: `teacher-001`, `teacher-002`, `teacher-003`
- **Students**: `student-001`, `student-002`, `student-003`, `student-004`, `student-005`

## 🧪 Testing Scenarios

### Teacher Experience
1. Log in as Dr. Michael Chen (teacher-001)
2. Navigate to MED201 course
3. View assignments with category tabs
4. Use filters and search functionality
5. Access grading interface for submissions
6. Test bulk actions and CSV export

### Student Experience
1. Log in as Alex Thompson (student-001)
2. View course assignments organized by category
3. See submission status and due dates
4. Test file upload and submission
5. View grades and feedback
6. Experience auto-reminders and late flags

### Admin Experience
1. Log in as Dr. Sarah Johnson (admin-001)
2. Access database administration page
3. Seed and clear test data
4. Monitor system-wide announcements
5. Access all course and user data

## 🛠️ Technical Details

### Collections Created
- `users` - User profiles and roles
- `courses` - Course information
- `assignments` - Assignment details
- `enrollments` - Student course enrollments
- `classSessions` - Class meeting schedules
- `announcements` - System announcements
- `submissions` - Student assignment submissions

### Data Relationships
- Users are linked to courses through enrollments
- Assignments belong to specific courses
- Submissions link students to assignments
- Sessions are scheduled for specific courses
- Announcements can be course-specific or global

### Timestamps
- All dates are relative to current time
- Assignments have realistic due dates (1-30 days from now)
- Sessions are scheduled for upcoming dates
- Submissions have recent submission dates

## 🧹 Cleanup

When you're finished testing:

1. Navigate to the Database Admin page
2. Click "Clear Test Data"
3. Confirm the action (requires double confirmation)
4. All seeded data will be permanently removed

**Warning**: This action cannot be undone and will affect all collections.

## 🔧 Customization

To modify the seeded data:

1. Edit `src/lib/seedDatabase.ts`
2. Modify the sample data arrays
3. Run the seeding process again

You can customize:
- User information and roles
- Course details and descriptions
- Assignment types and requirements
- Due dates and weights
- Sample submissions and grades

## 🚨 Important Notes

- **Development Only**: This seeding system is for development and testing only
- **Firebase Auth**: You may need to manually create Firebase Auth users
- **Real Data**: Never run this on a production database
- **Backup**: Always backup your database before testing
- **Permissions**: Ensure your Firestore rules allow these operations

## 📝 Troubleshooting

### Common Issues
1. **Permission Denied**: Check Firestore security rules
2. **Missing Collections**: Ensure all collection names match exactly
3. **Auth Errors**: Verify Firebase configuration
4. **Duplicate Data**: Clear existing data before re-seeding

### Debug Mode
Enable console logging to see detailed seeding progress:
```javascript
// In browser console
localStorage.setItem('debug', 'true');
runSeed();
```

## 📚 Additional Resources

- [Firebase Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [React Firebase Hooks](https://github.com/CSFrequency/react-firebase-hooks)

---

**Happy Testing! 🎉**

If you encounter any issues or need help customizing the data, check the console logs or refer to the Firebase documentation.
