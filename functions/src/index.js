import * as admin from "firebase-admin";
import { onCall, HttpsError } from "firebase-functions/v2/https";
admin.initializeApp();
const ALLOWED_ADMINS = new Set([
    // TODO: replace with your own UID from Firebase Console → Authentication
    "SGmmaakmWncvFSBzs84Kwr6RWFr1",
]);
// Callable: set a Firebase Auth custom claim { role: 'admin'|'teacher'|'student' }
export const setUserRole = onCall(async (request) => {
    // request.auth is populated only if the caller is signed in
    const caller = request.auth;
    if (!caller || !ALLOWED_ADMINS.has(caller.uid)) {
        throw new HttpsError("permission-denied", "Not allowed.");
    }
    const { uid, role } = (request.data ?? {});
    if (!uid || !role) {
        throw new HttpsError("invalid-argument", "uid and role are required");
    }
    await admin.auth().setCustomUserClaims(uid, { role });
    return { ok: true };
});
// Callable: find a Firebase user by email or uid (admin-only)
export const findUserByEmailOrUid = onCall(async (request) => {
    const caller = request.auth;
    if (!caller || !ALLOWED_ADMINS.has(caller.uid)) {
        throw new HttpsError("permission-denied", "Not allowed.");
    }
    const { emailOrUid } = (request.data ?? {});
    if (!emailOrUid) {
        throw new HttpsError("invalid-argument", "emailOrUid is required");
    }
    let userRecord = null;
    if (emailOrUid.includes("@")) {
        try {
            userRecord = await admin.auth().getUserByEmail(emailOrUid);
        }
        catch (e) {
            throw new HttpsError("not-found", "User not found");
        }
    }
    else {
        try {
            userRecord = await admin.auth().getUser(emailOrUid);
        }
        catch (e) {
            throw new HttpsError("not-found", "User not found");
        }
    }
    return { uid: userRecord.uid, email: userRecord.email ?? null };
});
