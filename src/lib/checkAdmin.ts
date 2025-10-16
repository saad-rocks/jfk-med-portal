// Quick admin check utility
// Run this in browser console to diagnose admin permission issues

import { auth } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

export async function checkAdminStatus() {

  // Check 1: Current user
  const user = auth.currentUser;
  if (!user) {
    return;
  }


  // Check 2: Firestore user document
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('uid', '==', user.uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
    } else {
      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();

      if (userData.role !== 'admin') {
      } else {
      }
    }
  } catch (error) {
  }


  // Check 3: Test getSystemSettings (any authenticated user)
  try {
    const fn = httpsCallable(functions, 'getSystemSettings');
    const result = await fn();
  } catch (error: any) {
  }


  // Check 4: Test updateSystemSettings (admin only)
  try {
    const fn = httpsCallable(functions, 'updateSystemSettings');
    const result = await fn({
      settings: {
        maintenanceMode: false,
        maintenanceMessage: 'Test from admin check'
      }
    });
  } catch (error: any) {

    if (error.code === 'functions/permission-denied') {
    }
  }

}

// Make it available globally
if (typeof window !== 'undefined') {
  (window as any).checkAdminStatus = checkAdminStatus;
}
