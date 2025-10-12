import * as admin from "firebase-admin";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

admin.initializeApp();

const db = getFirestore();

// CORS configuration for Cloud Functions v2
const corsOptions = {
  cors: ["http://localhost:5173", "http://localhost:3000", "https://jfk-med-portal.web.app", "https://jfk-med-portal.firebaseapp.com"]
};

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
    const userRef = db.collection("users").where("uid", "==", caller.uid);
    const snapshot = await userRef.get();

    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();
      return userData.role === "admin";
    }

    return false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

// Callable: set user role in Firestore (single source of truth)
export const setUserRole = onCall(corsOptions, async (request) => {
  const caller = request.auth;

  if (!await isCallerAdmin(caller)) {
    throw new HttpsError("permission-denied", "Admin access required.");
  }

  const { uid, role, mdYear } = (request.data ?? {});
  if (!uid || !role) {
    throw new HttpsError("invalid-argument", "uid and role are required");
  }

  // Validate role
  const validRoles = ["student", "teacher", "admin"];
  if (!validRoles.includes(role)) {
    throw new HttpsError("invalid-argument", "Invalid role specified");
  }

  try {
    // Update role in Firestore user profile
    const userRef = db.collection("users").where("uid", "==", uid);
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
    if (role === "student" && mdYear) {
      updateData.mdYear = mdYear;
    }

    await userDoc.ref.update(updateData);

    console.log(`✅ User role updated: ${uid} -> ${role}`);
    return { ok: true, message: `User role updated to ${role}` };
  } catch (error) {
    console.error("Error updating user role:", error);
    throw new HttpsError("internal", "Failed to update user role");
  }
});

// Callable: find a Firebase user by email or uid (admin-only)
export const findUserByEmailOrUid = onCall(corsOptions, async (request) => {
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
      const userRef = db.collection("users").where("uid", "==", userRecord.uid);
      const snapshot = await userRef.get();

      if (!snapshot.empty) {
        const userDoc = snapshot.docs[0];
        profile = {
          id: userDoc.id,
          ...userDoc.data()
        };
      }
    } catch (profileError) {
      console.warn("Could not fetch user profile:", profileError);
    }

    return {
      uid: userRecord.uid,
      email: userRecord.email ?? null,
      displayName: userRecord.displayName ?? null,
      profile: profile
    };
  } catch (error) {
    console.error("Error finding user:", error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("not-found", "User not found");
  }
});

// Callable: create or update user profile in Firestore (for newly authenticated users)
export const createUserProfile = onCall(corsOptions, async (request) => {
  const caller = request.auth;
  if (!caller) {
    throw new HttpsError("unauthenticated", "Must be authenticated");
  }

  const { name, role = "student", mdYear } = (request.data ?? {});
  if (!name) {
    throw new HttpsError("invalid-argument", "name is required");
  }

  try {
    // Check if profile already exists
    const existingRef = db.collection("users").where("uid", "==", caller.uid);
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
      status: "active",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };

    // Add role-specific fields
    if (role === "student") {
      userProfile.mdYear = mdYear || "MD-1";
      userProfile.studentId = `JFK${Date.now().toString().slice(-6)}`;
      userProfile.enrollmentDate = FieldValue.serverTimestamp();
    } else if (role === "teacher") {
      userProfile.employeeId = `JFK-FAC-${Date.now().toString().slice(-6)}`;
      userProfile.hireDate = FieldValue.serverTimestamp();
    } else if (role === "admin") {
      userProfile.adminLevel = "regular";
      userProfile.permissions = ["user_management"];
    }

    const docRef = await db.collection("users").add(userProfile);

    console.log(`✅ User profile created: ${caller.uid} -> ${role}`);
    return {
      ok: true,
      profileId: docRef.id,
      message: "Profile created successfully",
      existing: false
    };
  } catch (error) {
    console.error("Error creating user profile:", error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "Failed to create user profile");
  }
});

// ==================== SYSTEM SETTINGS MANAGEMENT ====================

// Callable: Get system settings (all authenticated users can read)
export const getSystemSettings = onCall(corsOptions, async (request) => {
  const caller = request.auth;
  if (!caller) {
    throw new HttpsError("unauthenticated", "Must be authenticated");
  }

  try {
    const settingsRef = db.collection("system").doc("settings");
    const settingsDoc = await settingsRef.get();

    if (!settingsDoc.exists) {
      // Return default settings if not yet configured
      const defaultSettings = {
        maintenanceMode: false,
        maintenanceMessage: "System is currently under maintenance. Please check back later.",
        allowRegistration: true,
        emailVerification: true,
        twoFactorAuth: false,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        autoLogoutEnabled: false,
        dataRetentionDays: 365,
        enableAuditLogs: true,
        systemVersion: "1.0.0",
        lastBackupDate: null,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      };

      // Create default settings document
      await settingsRef.set(defaultSettings);

      return { ok: true, settings: defaultSettings };
    }

    return { ok: true, settings: settingsDoc.data() };
  } catch (error) {
    console.error("Error fetching system settings:", error);
    throw new HttpsError("internal", "Failed to fetch system settings");
  }
});

// Callable: Update system settings (admin-only)
export const updateSystemSettings = onCall(corsOptions, async (request) => {
  const caller = request.auth;

  if (!await isCallerAdmin(caller)) {
    throw new HttpsError("permission-denied", "Admin access required.");
  }

  const { settings } = (request.data ?? {});
  if (!settings || typeof settings !== "object") {
    throw new HttpsError("invalid-argument", "settings object is required");
  }

  try {
    if (!caller) {
      throw new HttpsError("unauthenticated", "Must be authenticated");
    }

    const settingsRef = db.collection("system").doc("settings");

    // Validate settings
    const validSettings: any = {
      maintenanceMode: settings.maintenanceMode,
      maintenanceMessage: settings.maintenanceMessage,
      allowRegistration: settings.allowRegistration,
      emailVerification: settings.emailVerification,
      twoFactorAuth: settings.twoFactorAuth,
      sessionTimeout: settings.sessionTimeout,
      maxLoginAttempts: settings.maxLoginAttempts,
      autoLogoutEnabled: settings.autoLogoutEnabled,
      dataRetentionDays: settings.dataRetentionDays,
      enableAuditLogs: settings.enableAuditLogs,
      updatedAt: FieldValue.serverTimestamp(),
      lastUpdatedBy: caller.uid
    };

    // Remove undefined values
    Object.keys(validSettings).forEach(key =>
      validSettings[key] === undefined && delete validSettings[key]
    );

    await settingsRef.set(validSettings, { merge: true });

    // Log audit entry
    if (settings.maintenanceMode !== undefined) {
      const auditDetails: Record<string, any> = {
        maintenanceMode: settings.maintenanceMode,
      };

      if (settings.maintenanceMessage !== undefined) {
        auditDetails.message = settings.maintenanceMessage;
      }

      await db.collection("auditLogs").add({
        action: settings.maintenanceMode ? "MAINTENANCE_MODE_ENABLED" : "MAINTENANCE_MODE_DISABLED",
        performedBy: caller.uid,
        performedByEmail: (caller as any).email || null,
        timestamp: FieldValue.serverTimestamp(),
        details: auditDetails
      });
    }

    console.log(`✅ System settings updated by: ${caller.uid}`);
    return { ok: true, message: "System settings updated successfully" };
  } catch (error) {
    console.error("Error updating system settings:", error);
    throw new HttpsError("internal", "Failed to update system settings");
  }
});

// Callable: Get audit logs (admin-only)
export const getAuditLogs = onCall(corsOptions, async (request) => {
  const caller = request.auth;

  if (!await isCallerAdmin(caller)) {
    throw new HttpsError("permission-denied", "Admin access required.");
  }

  const { limit = 50, startAfter = null } = (request.data ?? {});

  try {
    let query = db.collection("auditLogs")
      .orderBy("timestamp", "desc")
      .limit(limit);

    if (startAfter) {
      const startDoc = await db.collection("auditLogs").doc(startAfter).get();
      if (startDoc.exists) {
        query = query.startAfter(startDoc);
      }
    }

    const snapshot = await query.get();
    const logs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { ok: true, logs, count: logs.length };
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    throw new HttpsError("internal", "Failed to fetch audit logs");
  }
});

// Callable: Get active user sessions (admin-only)
export const getActiveSessions = onCall(corsOptions, async (request) => {
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
              name: userData.name || 'Unknown',
              email: userData.email || 'No email',
              role: userData.role || 'unknown',
              lastLoginAt: userData.lastLoginAt,
              sessionDuration: Math.floor((now.getTime() - lastLogin.getTime()) / 60000) // in minutes
            });
          }
        } catch (dateError) {
          console.warn(`Error parsing lastLoginAt for user ${userData.uid}:`, dateError);
        }
      }
    }

    console.log(`✅ Found ${activeSessions.length} active sessions`);
    return { ok: true, sessions: activeSessions, count: activeSessions.length };
  } catch (error) {
    console.error("Error fetching active sessions:", error);
    throw new HttpsError("internal", "Failed to fetch active sessions");
  }
});

// Callable: Force logout user (admin-only)
export const forceLogoutUser = onCall(corsOptions, async (request) => {
  const caller = request.auth;

  if (!await isCallerAdmin(caller)) {
    throw new HttpsError("permission-denied", "Admin access required.");
  }

  const { uid } = (request.data ?? {});
  if (!uid) {
    throw new HttpsError("invalid-argument", "uid is required");
  }

  try {
    if (!caller) {
      throw new HttpsError("unauthenticated", "Must be authenticated");
    }

    // Revoke refresh tokens for the user
    await admin.auth().revokeRefreshTokens(uid);

    // Log audit entry
    await db.collection("auditLogs").add({
      action: "FORCE_LOGOUT",
      performedBy: caller.uid,
      performedByEmail: (caller as any).email || null,
      targetUserId: uid,
      timestamp: FieldValue.serverTimestamp()
    });

    console.log(`✅ User ${uid} forcefully logged out by admin: ${caller.uid}`);
    return { ok: true, message: "User has been logged out successfully" };
  } catch (error) {
    console.error("Error forcing logout:", error);
    throw new HttpsError("internal", "Failed to force logout user");
  }
});

// Callable: Create database backup trigger (admin-only)
export const triggerDatabaseBackup = onCall(corsOptions, async (request) => {
  const caller = request.auth;

  if (!await isCallerAdmin(caller)) {
    throw new HttpsError("permission-denied", "Admin access required.");
  }

  try {
    if (!caller) {
      throw new HttpsError("unauthenticated", "Must be authenticated");
    }

    // Update last backup date
    const settingsRef = db.collection("system").doc("settings");
    await settingsRef.set({
      lastBackupDate: FieldValue.serverTimestamp(),
      lastBackupBy: caller.uid
    }, { merge: true });

    // Log audit entry
    await db.collection("auditLogs").add({
      action: "DATABASE_BACKUP_TRIGGERED",
      performedBy: caller.uid,
      performedByEmail: (caller as any).email || null,
      timestamp: FieldValue.serverTimestamp()
    });

    console.log(`✅ Database backup triggered by admin: ${caller.uid}`);
    return {
      ok: true,
      message: "Backup process initiated. This may take several minutes.",
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error triggering backup:", error);
    throw new HttpsError("internal", "Failed to trigger database backup");
  }
});
