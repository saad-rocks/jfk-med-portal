# Fix: "Failed to update system settings" Error

## 🔍 Root Cause
The error means you're getting a "permission-denied" - your user is not recognized as admin.

---

## ✅ Quick Fix - Add Your UID to Allowed Admins

### Step 1: Get Your UID

Open browser console (F12) and run:
```javascript
import { auth } from './firebase';
console.log('My UID:', auth.currentUser?.uid);
```

Or simpler:
```javascript
// Just paste this in console
console.log('My UID:', window.firebase?.auth()?.currentUser?.uid);
```

**Copy your UID** (it looks like: `SGmmaakmWncvFSBzs84Kwr6RWFr1`)

---

### Step 2: Add UID to Allowed Admins List

Open: `functions/src/index.ts`

Find this section (around line 10-13):
```typescript
const ALLOWED_ADMIN_UIDS = new Set([
  // TODO: replace with your own UID from Firebase Console → Authentication
  "SGmmaakmWncvFSBzs84Kwr6RWFr1",
]);
```

Add your UID:
```typescript
const ALLOWED_ADMIN_UIDS = new Set([
  "SGmmaakmWncvFSBzs84Kwr6RWFr1",
  "YOUR_UID_HERE",  // Replace with your actual UID
]);
```

---

### Step 3: Redeploy Functions

```bash
cd functions
npm run build
firebase deploy --only functions
```

Wait 2-3 minutes for deployment.

---

### Step 4: Test Again

1. Refresh your app
2. Try toggling maintenance mode again
3. Should work! ✅

---

## 🔧 Alternative Fix - Check Firestore User Document

Your user might have admin role in Firestore but the check is failing.

### Option A: Check Your User Document

1. Go to [Firebase Console → Firestore](https://console.firebase.google.com/project/jfk-med-portal/firestore/data)
2. Open `users` collection
3. Find your user document (search by email or UID)
4. Make sure it has: `role: "admin"` (exactly, lowercase)

### Option B: Update User Document

If your role is not "admin", update it:
```javascript
// In browser console after logging in:
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db, auth } from './firebase';

async function makeAdmin() {
  const uid = auth.currentUser?.uid;
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('uid', '==', uid));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    await updateDoc(snapshot.docs[0].ref, { role: 'admin' });
    console.log('✅ Updated to admin');
  }
}

makeAdmin();
```

---

## 🧪 Debug: Test if You're Admin

Run this in browser console to check:
```javascript
import { httpsCallable } from 'firebase/functions';
import { functions, auth } from './firebase';

async function testAdmin() {
  console.log('Current UID:', auth.currentUser?.uid);
  console.log('Current Email:', auth.currentUser?.email);

  try {
    const fn = httpsCallable(functions, 'getSystemSettings');
    const result = await fn();
    console.log('✅ Can call getSystemSettings (any authenticated user)');
  } catch (error) {
    console.error('❌ Cannot call getSystemSettings:', error);
  }

  try {
    const fn = httpsCallable(functions, 'updateSystemSettings');
    const result = await fn({
      settings: { maintenanceMode: false }
    });
    console.log('✅ Can call updateSystemSettings - YOU ARE ADMIN!');
  } catch (error) {
    console.error('❌ Cannot call updateSystemSettings:', error.message);
    if (error.code === 'functions/permission-denied') {
      console.error('⚠️ YOU ARE NOT RECOGNIZED AS ADMIN');
      console.error('Fix: Add your UID to ALLOWED_ADMIN_UIDS or set role="admin" in Firestore');
    }
  }
}

testAdmin();
```

---

## 📋 Quick Checklist

To fix the error, you need EITHER:

### Option 1: Add UID to allowed list (Recommended - Fastest)
- [ ] Get your UID from browser console
- [ ] Add to `ALLOWED_ADMIN_UIDS` in `functions/src/index.ts`
- [ ] Redeploy: `firebase deploy --only functions`
- [ ] Test again

### Option 2: Ensure Firestore role is correct
- [ ] Check user document in Firestore
- [ ] Ensure `role: "admin"` (lowercase)
- [ ] Test again

---

## 🎯 Expected Behavior After Fix

When you toggle maintenance mode:
1. ✅ Shows "System Settings Updated" success message
2. ✅ Toggle updates immediately
3. ✅ Creates audit log entry
4. ✅ Non-admin users see maintenance page

---

## 💡 Pro Tip: View Detailed Error

To see the exact error, open browser DevTools:
1. Press F12
2. Go to "Network" tab
3. Toggle maintenance mode
4. Find the `updateSystemSettings` request
5. Click it → Response tab
6. See the exact error message

Likely you'll see:
```json
{
  "error": {
    "code": "permission-denied",
    "message": "Admin access required."
  }
}
```

---

## 🚀 After Fixing

Once fixed, try these to confirm:
- [ ] Toggle maintenance mode ON → works
- [ ] Open incognito → login as student/teacher → see maintenance page
- [ ] Toggle OFF → non-admin can access
- [ ] Check Audit Logs tab → see "MAINTENANCE_MODE_ENABLED/DISABLED" entries

---

Need help? Share:
1. Your UID from browser console
2. Your user document from Firestore (screenshot)
3. The exact error message from Network tab
