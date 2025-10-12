# System Settings Functions - Debugging Guide

## Issues Identified

### 1. Functions Not Deployed
The Cloud Functions need to be deployed to Firebase before they can be used.

### 2. Potential Issues

Based on my deep analysis, here are the issues I found:

#### **Issue #1: Functions Not Deployed**
**Problem:** Running `firebase functions:list` shows no deployed functions.
**Solution:** Deploy the functions using:
```bash
cd functions
firebase deploy --only functions
```

#### **Issue #2: Audit Logs Query Missing Index**
**Problem:** The `getAuditLogs` function queries with `.orderBy("timestamp", "desc")` which requires a Firestore index.
**Error:** You'll see: "The query requires an index"
**Solution:** Create a composite index in Firestore:
1. Go to Firebase Console > Firestore Database > Indexes
2. Create a composite index:
   - Collection ID: `auditLogs`
   - Fields: `timestamp` (Descending)

#### **Issue #3: lastLoginAt Field May Not Exist**
**Problem:** The `getActiveSessions` function assumes `lastLoginAt` field exists on user documents.
**Error:** Users without this field won't show up in active sessions.
**Solution:** We need to track user logins. Add this to your login logic.

#### **Issue #4: CORS Issues (If Testing Locally)**
**Problem:** If you're running the app locally and calling production functions, you may hit CORS errors.
**Solution:** Use Firebase emulators or ensure proper CORS configuration.

---

## Step-by-Step Testing Guide

### Step 1: Deploy the Functions
```bash
cd functions
npm run build
firebase deploy --only functions
```

Expected output: Should show 6 functions being deployed:
- `setUserRole`
- `findUserByEmailOrUid`
- `createUserProfile`
- `getSystemSettings`
- `updateSystemSettings`
- `getAuditLogs`
- `getActiveSessions`
- `forceLogoutUser`
- `triggerDatabaseBackup`

### Step 2: Check Function Deployment
```bash
firebase functions:list
```

You should see all 9 functions listed.

### Step 3: Test getSystemSettings (Should work first time)
Open browser console and run:
```javascript
import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

const getSettings = httpsCallable(functions, 'getSystemSettings');
getSettings().then(result => console.log(result.data)).catch(err => console.error(err));
```

### Step 4: Create Firestore Index for Audit Logs
Before testing audit logs, create the index:

**Option A: Via Firebase Console**
1. Go to: https://console.firebase.google.com/project/jfk-med-portal/firestore/indexes
2. Click "Create Index"
3. Collection ID: `auditLogs`
4. Add field: `timestamp`, Order: Descending
5. Query scope: Collection
6. Click "Create"

**Option B: Via Error Link**
1. Try to call `getAuditLogs`
2. It will fail with error containing a link
3. Click the link to auto-create the index

### Step 5: Test Each Function

#### Test updateSystemSettings:
```javascript
const updateSettings = httpsCallable(functions, 'updateSystemSettings');
updateSettings({
  settings: {
    maintenanceMode: false,
    maintenanceMessage: "Test message"
  }
}).then(r => console.log(r)).catch(e => console.error(e));
```

#### Test getAuditLogs (after index is created):
```javascript
const getLogs = httpsCallable(functions, 'getAuditLogs');
getLogs({ limit: 10 }).then(r => console.log(r.data)).catch(e => console.error(e));
```

#### Test getActiveSessions:
```javascript
const getSessions = httpsCallable(functions, 'getActiveSessions');
getSessions().then(r => console.log(r.data)).catch(e => console.error(e));
```

#### Test triggerBackup:
```javascript
const backup = httpsCallable(functions, 'triggerDatabaseBackup');
backup().then(r => console.log(r.data)).catch(e => console.error(e));
```

---

## Common Errors and Solutions

### Error: "internal"
**Cause:** Function threw an uncaught error
**Debug:** Check Firebase Functions logs:
```bash
firebase functions:log
```

### Error: "permission-denied"
**Cause:** User is not an admin
**Check:**
1. Your user's role in Firestore `users` collection
2. Your UID is in `ALLOWED_ADMIN_UIDS` array in `functions/src/index.ts`

### Error: "CORS error" or "Failed to fetch"
**Cause:** Network or CORS issue
**Solution:**
- Make sure functions are deployed (not trying to call non-existent endpoints)
- Check your network connection
- Try clearing browser cache

### Error: "Function not found"
**Cause:** Function name mismatch or not deployed
**Solution:**
- Verify function name spelling
- Run `firebase deploy --only functions`

### Error: "The query requires an index"
**Cause:** Firestore composite index not created
**Solution:** Follow Step 4 above to create the index

---

## Quick Fixes

### Fix #1: Update functions/src/index.ts to handle missing lastLoginAt
Replace the getActiveSessions function with this improved version:

```typescript
export const getActiveSessions = onCall(async (request) => {
  const caller = request.auth;

  if (!await isCallerAdmin(caller)) {
    throw new HttpsError("permission-denied", "Admin access required.");
  }

  try {
    // Get all users with their last login time
    const usersSnapshot = await db.collection("users")
      .where("status", "==", "active")
      .get();

    const activeSessions = [];
    const now = new Date();
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

    for (const doc of usersSnapshot.docs) {
      const userData = doc.data();

      // Check if user has recent activity and lastLoginAt exists
      if (userData.lastLoginAt && typeof userData.lastLoginAt.toDate === 'function') {
        try {
          const lastLogin = userData.lastLoginAt.toDate();

          if (lastLogin > thirtyMinutesAgo) {
            activeSessions.push({
              uid: userData.uid,
              name: userData.name,
              email: userData.email,
              role: userData.role,
              lastLoginAt: userData.lastLoginAt,
              sessionDuration: Math.floor((now.getTime() - lastLogin.getTime()) / 60000)
            });
          }
        } catch (dateError) {
          console.warn(`Error parsing lastLoginAt for user ${userData.uid}:`, dateError);
        }
      }
    }

    return { ok: true, sessions: activeSessions, count: activeSessions.length };
  } catch (error) {
    console.error("Error fetching active sessions:", error);
    throw new HttpsError("internal", "Failed to fetch active sessions");
  }
});
```

### Fix #2: Track User Login Time
Add to your login logic (src/pages/Login.tsx or wherever you handle auth):

```typescript
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// After successful login:
const updateLastLogin = async (uid: string) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      lastLoginAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating last login:', error);
  }
};
```

---

## Checklist Before Testing

- [ ] Functions compiled successfully (`npm run build`)
- [ ] Functions deployed (`firebase deploy --only functions`)
- [ ] User is logged in as admin
- [ ] User's UID is in ALLOWED_ADMIN_UIDS or role is "admin" in Firestore
- [ ] Firestore index created for auditLogs.timestamp
- [ ] Browser console open to see errors
- [ ] Network tab open in DevTools

---

## Testing the UI

1. **Login as Admin**
2. **Go to Settings** → Click Admin Settings
3. **Try each tab:**
   - System: Toggle maintenance mode
   - Backup: Click "Trigger Backup Now"
   - Sessions: Click "Refresh" (may be empty if no lastLoginAt)
   - Audit: Click "Refresh"
   - Notifications: Toggle switches
   - Security: Change password

4. **Check Browser Console** for any errors

---

## What Errors Are You Seeing?

Please provide:
1. **Exact error message** from browser console
2. **Which function** is failing
3. **Network tab** - Status code of the failed request
4. **Firebase Functions logs** - Any errors shown there

This will help me pinpoint the exact issue!
