import * as admin from "firebase-admin";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

admin.initializeApp();

const db = getFirestore();

// Admin UIDs that can perform user management operations
const ALLOWED_ADMIN_UIDS = new Set([
  // TODO: replace with your own UID from Firebase Console → Authentication
  "SGmmaakmWncvFSBzs84Kwr6RWFr1",
]);

// Helper function to check if caller is admin
async function isCallerAdmin(caller: any): Promise<boolean> {
  if (!caller || !caller.uid) return false;

  try {
    // Check if UID is in allowed list
    if (ALLOWED_ADMIN_UIDS.has(caller.uid)) {
      return true;
    }

    // Check if user has admin role in Firestore
    const userRef = db.collection('users').where('uid', '==', caller.uid);
    const snapshot = await userRef.get();

    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();
      return userData.role === 'admin';
    }

    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

// Callable: set user role in Firestore (single source of truth)
export const setUserRole = onCall(async (request) => {
  const caller = request.auth;

  if (!await isCallerAdmin(caller)) {
    throw new HttpsError("permission-denied", "Admin access required.");
  }

  const { uid, role, mdYear } = (request.data ?? {});
  if (!uid || !role) {
    throw new HttpsError("invalid-argument", "uid and role are required");
  }

  // Validate role
  const validRoles = ['student', 'teacher', 'admin'];
  if (!validRoles.includes(role)) {
    throw new HttpsError("invalid-argument", "Invalid role specified");
  }

  try {
    // Update role in Firestore user profile
    const userRef = db.collection('users').where('uid', '==', uid);
    const snapshot = await userRef.get();

    if (snapshot.empty) {
      throw new HttpsError("not-found", "User profile not found");
    }

    const userDoc = snapshot.docs[0];
    const updateData: any = {
      role,
      updatedAt: FieldValue.serverTimestamp()
    };

    // Add MD year for students
    if (role === 'student' && mdYear) {
      updateData.mdYear = mdYear;
    }

    await userDoc.ref.update(updateData);

    console.log(`✅ User role updated: ${uid} -> ${role}`);
    return { ok: true, message: `User role updated to ${role}` };
  } catch (error) {
    console.error('Error updating user role:', error);
    throw new HttpsError("internal", "Failed to update user role");
  }
});

// Callable: find a Firebase user by email or uid (admin-only)
export const findUserByEmailOrUid = onCall(async (request) => {
  const caller = request.auth;

  if (!await isCallerAdmin(caller)) {
    throw new HttpsError("permission-denied", "Admin access required.");
  }

  const { emailOrUid } = (request.data ?? {});
  if (!emailOrUid) {
    throw new HttpsError("invalid-argument", "emailOrUid is required");
  }

  try {
    let userRecord = null;

    if (emailOrUid.includes("@")) {
      userRecord = await admin.auth().getUserByEmail(emailOrUid);
    } else {
      userRecord = await admin.auth().getUser(emailOrUid);
    }

    // Also get Firestore profile if it exists
    let profile = null;
    try {
      const userRef = db.collection('users').where('uid', '==', userRecord.uid);
      const snapshot = await userRef.get();

      if (!snapshot.empty) {
        const userDoc = snapshot.docs[0];
        profile = {
          id: userDoc.id,
          ...userDoc.data()
        };
      }
    } catch (profileError) {
      console.warn('Could not fetch user profile:', profileError);
    }

    return {
      uid: userRecord.uid,
      email: userRecord.email ?? null,
      displayName: userRecord.displayName ?? null,
      profile: profile
    };
  } catch (error) {
    console.error('Error finding user:', error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("not-found", "User not found");
  }
});

// Callable: create or update user profile in Firestore (for newly authenticated users)
export const createUserProfile = onCall(async (request) => {
  const caller = request.auth;
  if (!caller) {
    throw new HttpsError("unauthenticated", "Must be authenticated");
  }

  const { name, role = 'student', mdYear } = (request.data ?? {});
  if (!name) {
    throw new HttpsError("invalid-argument", "name is required");
  }

  try {
    // Check if profile already exists
    const existingRef = db.collection('users').where('uid', '==', caller.uid);
    const existingSnapshot = await existingRef.get();

    if (!existingSnapshot.empty) {
      // Profile already exists - return success
      const existingDoc = existingSnapshot.docs[0];
      console.log(`ℹ️ User profile already exists: ${caller.uid} -> ${existingDoc.data().role}`);
      return {
        ok: true,
        profileId: existingDoc.id,
        message: "Profile already exists",
        existing: true
      };
    }

    // Create new user profile
    const userProfile: any = {
      uid: caller.uid,
      name: name,
      email: (caller as any).email || null,
      role: role,
      status: 'active',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };

    // Add role-specific fields
    if (role === 'student') {
      userProfile.mdYear = mdYear || 'MD-1';
      userProfile.studentId = `JFK${Date.now().toString().slice(-6)}`;
      userProfile.enrollmentDate = FieldValue.serverTimestamp();
    } else if (role === 'teacher') {
      userProfile.employeeId = `JFK-FAC-${Date.now().toString().slice(-6)}`;
      userProfile.hireDate = FieldValue.serverTimestamp();
    } else if (role === 'admin') {
      userProfile.adminLevel = 'regular';
      userProfile.permissions = ['user_management'];
    }

    const docRef = await db.collection('users').add(userProfile);

    console.log(`✅ User profile created: ${caller.uid} -> ${role}`);
    return {
      ok: true,
      profileId: docRef.id,
      message: "Profile created successfully",
      existing: false
    };
  } catch (error) {
    console.error('Error creating user profile:', error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "Failed to create user profile");
  }
});
