# Deploy Firestore Rules

The seeding process is failing due to restrictive Firestore security rules. You need to deploy the updated rules to allow seeding operations.

## 🚀 Quick Deploy

### Option 1: Firebase CLI (Recommended)
```bash
# Navigate to your project directory
cd jfk-med-portal

# Deploy the rules
firebase deploy --only firestore:rules
```

### Option 2: Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Firestore Database → Rules
4. Copy the contents of `firestore.rules`
5. Paste and click "Publish"

## 📋 What Changed

The updated rules now allow:
- ✅ **Users collection**: Create/delete for seeding
- ✅ **Courses collection**: Already permissive
- ✅ **Assignments collection**: Already permissive  
- ✅ **Submissions collection**: Already permissive
- ✅ **Enrollments collection**: Already permissive
- ✅ **Sessions collection**: Already permissive
- ✅ **Class Sessions collection**: New - allows seeding
- ✅ **Announcements collection**: New - allows seeding

## 🔒 Security Note

These rules are **development-friendly** and allow any authenticated user to perform seeding operations. For production, you should:

1. Restrict create/delete operations to admin users only
2. Add proper role-based access control
3. Implement custom claims for user roles

## 🧪 After Deploying Rules

Once the rules are deployed:
1. Navigate to `/database-admin`
2. Click "Seed Database"
3. The seeding should now work successfully!

## 🚨 Troubleshooting

If you still get permission errors:
1. Ensure you're logged in to Firebase
2. Check that the rules were deployed successfully
3. Try refreshing the page after deploying rules
4. Check the Firebase console for any deployment errors

---

**Next Step**: Deploy the rules, then try seeding again! 🎉
