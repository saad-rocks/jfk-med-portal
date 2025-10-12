# System Settings Functions - Error Fix Guide

## 🔍 Problem Analysis

After deep checking, here are the issues I found:

### **Issue #1: Functions Not Deployed** ⚠️
**Status:** CRITICAL - Functions don't exist on Firebase yet
**What's wrong:** Running `firebase functions:list` shows no functions are deployed
**Impact:** All function calls will fail with "Function not found" or similar errors

### **Issue #2: Firestore Index Missing** ⚠️
**Status:** WILL FAIL on first audit log query
**What's wrong:** `getAuditLogs` queries with `.orderBy("timestamp")` which needs an index
**Impact:** First call to audit logs will fail with "index required" error

### **Issue #3: Missing lastLoginAt Field** ⚠️
**Status:** Sessions will appear empty
**What's wrong:** User documents don't have `lastLoginAt` timestamp
**Impact:** Active sessions tab will always show "No active sessions"

---

## 🛠️ Complete Fix - Step by Step

### **Step 1: Deploy the Functions** (REQUIRED)

```bash
# Navigate to functions directory
cd functions

# Build the functions
npm run build

# Deploy to Firebase
firebase deploy --only functions
```

**Expected output:**
```
✔  functions[getSystemSettings(us-central1)] Successful create operation.
✔  functions[updateSystemSettings(us-central1)] Successful create operation.
✔  functions[getAuditLogs(us-central1)] Successful create operation.
✔  functions[getActiveSessions(us-central1)] Successful create operation.
✔  functions[forceLogoutUser(us-central1)] Successful create operation.
✔  functions[triggerDatabaseBackup(us-central1)] Successful create operation.
```

**If deployment fails:**
- Check you're logged in: `firebase login`
- Check project: `firebase use jfk-med-portal`
- Check billing is enabled on Firebase Console

---

### **Step 2: Verify Functions Are Deployed**

```bash
firebase functions:list
```

You should see all 9 functions (including the 3 original + 6 new ones).

---

### **Step 3: Test Functions (Browser Console)**

1. **Start your dev server:**
```bash
npm run dev
```

2. **Open browser** and login as admin

3. **Open DevTools Console** (F12)

4. **Run automated tests:**
```javascript
// This will test all functions
window.testSystemFunctions.runAllTests()
```

---

### **Step 4: Fix Specific Errors**

#### **Error A: "permission-denied"**

**Cause:** User is not recognized as admin

**Fix Option 1:** Add your UID to allowed admins
1. Get your UID from browser console:
```javascript
import { auth } from './firebase';
console.log('My UID:', auth.currentUser?.uid);
```

2. Add UID to `functions/src/index.ts`:
```typescript
const ALLOWED_ADMIN_UIDS = new Set([
  "SGmmaakmWncvFSBzs84Kwr6RWFr1",  // existing
  "YOUR_UID_HERE"  // add yours
]);
```

3. Rebuild and redeploy:
```bash
cd functions
npm run build
firebase deploy --only functions
```

**Fix Option 2:** Ensure your Firestore user document has `role: "admin"`
1. Go to Firebase Console > Firestore
2. Find your user in `users` collection
3. Make sure `role` field = `"admin"`

---

#### **Error B: "The query requires an index"**

**Cause:** Firestore needs a composite index for audit logs

**Fix - Option 1 (Easiest):**
1. Try to call `getAuditLogs` function
2. The error will contain a clickable link
3. Click the link - it will open Firebase Console
4. Click "Create Index"
5. Wait 2-3 minutes for index to build

**Fix - Option 2 (Manual):**
1. Go to: [Firebase Console > Firestore > Indexes](https://console.firebase.google.com/project/jfk-med-portal/firestore/indexes)
2. Click "Create Index"
3. Settings:
   - Collection ID: `auditLogs`
   - Field: `timestamp` - Order: `Descending`
   - Query scope: `Collection`
4. Click "Create"

---

#### **Error C: "No active sessions found" (not an error, but expected)**

**Cause:** User documents don't have `lastLoginAt` field

**Fix:** Track user login time

Add this to your authentication flow (where users login):

```typescript
// src/lib/users.ts or wherever you handle login

import { doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export async function trackUserLogin(uid: string) {
  try {
    // Find user document by UID
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('uid', '==', uid));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0];
      await updateDoc(userDoc.ref, {
        lastLoginAt: serverTimestamp()
      });
      console.log('✅ Updated lastLoginAt for user:', uid);
    }
  } catch (error) {
    console.error('Error tracking login:', error);
  }
}
```

Then call it after successful login:
```typescript
// In your login handler
await signInWithEmailAndPassword(auth, email, password);
await trackUserLogin(auth.currentUser!.uid);
```

**Alternative Quick Fix:** Manually add `lastLoginAt` to your user document:
1. Go to Firebase Console > Firestore
2. Find your user document in `users` collection
3. Add field: `lastLoginAt` (type: timestamp) = now

---

## 🧪 Testing Each Function

### Test 1: Get System Settings
```javascript
window.testSystemFunctions.testGetSettings()
```
**Expected:** Should return system settings object
**If fails:** Check if functions are deployed

### Test 2: Update System Settings
```javascript
window.testSystemFunctions.testUpdateSettings({
  maintenanceMode: false,
  maintenanceMessage: "Test message"
})
```
**Expected:** Should return `{ ok: true, message: "..." }`
**If fails:** Check admin permissions

### Test 3: Get Audit Logs
```javascript
window.testSystemFunctions.testGetAuditLogs()
```
**Expected:** Should return array of logs (might be empty)
**If fails:** Create Firestore index (see Error B above)

### Test 4: Get Active Sessions
```javascript
window.testSystemFunctions.testGetActiveSessions()
```
**Expected:** Should return array (might be empty if no lastLoginAt)
**If fails:** Check admin permissions

### Test 5: Trigger Backup
```javascript
window.testSystemFunctions.testTriggerBackup()
```
**Expected:** Should return success message
**If fails:** Check admin permissions

---

## 🎯 Testing the UI

After functions are deployed and working:

1. **Login as admin**
2. **Go to Settings page** (click Settings in sidebar)
3. **Test each tab:**

   **System Tab:**
   - Toggle "Maintenance Mode" on/off
   - Change session timeout
   - All changes should save to Firebase

   **Backup Tab:**
   - Click "Trigger Backup Now"
   - Should show "Processing..."
   - Then show success message
   - Last backup date should update

   **Sessions Tab:**
   - Click "Refresh"
   - Should show active users (if any have lastLoginAt)
   - Try "Force Logout" on a user (test with a test account)

   **Audit Tab:**
   - Click "Refresh"
   - Should show recent actions
   - If fails, create the Firestore index

---

## 📝 Common Error Messages & Solutions

| Error Message | Cause | Solution |
|--------------|-------|----------|
| `Function not found` | Functions not deployed | Run `firebase deploy --only functions` |
| `permission-denied` | Not recognized as admin | Add UID to ALLOWED_ADMIN_UIDS or set role="admin" in Firestore |
| `unauthenticated` | Not logged in | Login to the app first |
| `The query requires an index` | Firestore index missing | Click the error link or create index manually |
| `internal` | Server error | Check Firebase Functions logs: `firebase functions:log` |
| Network error / CORS | Functions not accessible | Check functions are deployed and network is working |

---

## 🔥 Firebase Console Quick Links

- [Functions Dashboard](https://console.firebase.google.com/project/jfk-med-portal/functions/list)
- [Firestore Database](https://console.firebase.google.com/project/jfk-med-portal/firestore/data)
- [Firestore Indexes](https://console.firebase.google.com/project/jfk-med-portal/firestore/indexes)
- [Authentication Users](https://console.firebase.google.com/project/jfk-med-portal/authentication/users)
- [Functions Logs](https://console.firebase.google.com/project/jfk-med-portal/functions/logs)

---

## ❓ Still Getting Errors?

If you're still seeing errors after following all steps:

### Provide me with:

1. **Exact error message** from browser console
2. **Screenshot** of the error
3. **Network tab** response (in DevTools)
4. **Which function** is failing
5. **Output of:**
   ```bash
   firebase functions:list
   ```

### Check these:

- [ ] Functions deployed successfully
- [ ] Logged in as admin user
- [ ] User role is "admin" in Firestore OR UID in ALLOWED_ADMIN_UIDS
- [ ] Firestore index created for auditLogs
- [ ] Browser console shows no CORS errors
- [ ] Firebase billing is enabled

---

## 🎉 Success Checklist

When everything works, you should be able to:

- [ ] Toggle maintenance mode and non-admins see maintenance page
- [ ] View and update all system settings
- [ ] Trigger database backups
- [ ] View active user sessions
- [ ] Force logout users
- [ ] View audit logs of all admin actions
- [ ] All settings persist across page refreshes
- [ ] Settings sync in real-time across multiple admin sessions

---

**Next Steps After Fixing:**

1. Deploy functions: `firebase deploy --only functions`
2. Run tests in browser console
3. Test UI functionality
4. Report back any specific errors you see!
