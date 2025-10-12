// Quick admin check utility
// Run this in browser console to diagnose admin permission issues

import { auth } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

export async function checkAdminStatus() {
  console.log('🔍 Checking Admin Status...');
  console.log('='.repeat(50));

  // Check 1: Current user
  const user = auth.currentUser;
  if (!user) {
    console.error('❌ Not logged in!');
    return;
  }

  console.log('✅ Logged in as:');
  console.log('   UID:', user.uid);
  console.log('   Email:', user.email);
  console.log('');

  // Check 2: Firestore user document
  console.log('🔍 Checking Firestore user document...');
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('uid', '==', user.uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.error('❌ No user document found in Firestore!');
      console.log('   Create profile first');
    } else {
      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();
      console.log('✅ User document found:');
      console.log('   Role:', userData.role);
      console.log('   Name:', userData.name);
      console.log('   Status:', userData.status);
      console.log('   Admin Level:', userData.adminLevel || 'N/A');

      if (userData.role !== 'admin') {
        console.error('⚠️ Your role is NOT "admin"');
        console.log('   Current role:', userData.role);
        console.log('   You need role="admin" to access admin functions');
      } else {
        console.log('✅ Role is "admin"');
      }
    }
  } catch (error) {
    console.error('❌ Error checking Firestore:', error);
  }

  console.log('');

  // Check 3: Test getSystemSettings (any authenticated user)
  console.log('🧪 Testing getSystemSettings (should work for any user)...');
  try {
    const fn = httpsCallable(functions, 'getSystemSettings');
    const result = await fn();
    console.log('✅ getSystemSettings works!');
    console.log('   Settings:', result.data);
  } catch (error: any) {
    console.error('❌ getSystemSettings failed:', error.message);
    console.error('   Code:', error.code);
  }

  console.log('');

  // Check 4: Test updateSystemSettings (admin only)
  console.log('🧪 Testing updateSystemSettings (admin only)...');
  try {
    const fn = httpsCallable(functions, 'updateSystemSettings');
    const result = await fn({
      settings: {
        maintenanceMode: false,
        maintenanceMessage: 'Test from admin check'
      }
    });
    console.log('✅ updateSystemSettings works! YOU ARE ADMIN! 🎉');
    console.log('   Result:', result.data);
  } catch (error: any) {
    console.error('❌ updateSystemSettings failed');
    console.error('   Message:', error.message);
    console.error('   Code:', error.code);

    if (error.code === 'functions/permission-denied') {
      console.error('');
      console.error('⚠️ PERMISSION DENIED - YOU ARE NOT RECOGNIZED AS ADMIN');
      console.error('');
      console.error('📝 TO FIX:');
      console.error('1. Copy your UID:', user.uid);
      console.error('2. Open: functions/src/index.ts');
      console.error('3. Add your UID to ALLOWED_ADMIN_UIDS:');
      console.error('   const ALLOWED_ADMIN_UIDS = new Set([');
      console.error('     "SGmmaakmWncvFSBzs84Kwr6RWFr1",');
      console.error(`     "${user.uid}",  // Your UID`);
      console.error('   ]);');
      console.error('4. Run: cd functions && npm run build && firebase deploy --only functions');
      console.error('5. Wait 2-3 minutes and try again');
    }
  }

  console.log('');
  console.log('='.repeat(50));
  console.log('Check complete!');
}

// Make it available globally
if (typeof window !== 'undefined') {
  (window as any).checkAdminStatus = checkAdminStatus;
  console.log('💡 Run: window.checkAdminStatus()');
}
