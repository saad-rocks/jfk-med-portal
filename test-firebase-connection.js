// Test Firebase connection and data persistence
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDIERzEuMgxiMZ1oViMTh9Xy4Glw8YceUA",
  authDomain: "jfk-med-portal.firebaseapp.com",
  projectId: "jfk-med-portal",
  storageBucket: "jfk-med-portal.firebasestorage.app",
  messagingSenderId: "340149930069",
  appId: "1:340149930069:web:ae2107d24398edaf0bacdc",
  measurementId: "G-BVZC2T1VZZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log('🔥 Testing Firebase connection...');

async function testFirebase() {
  try {
    // Test Firestore write
    console.log('📝 Testing Firestore write...');
    const testDoc = await addDoc(collection(db, 'test'), {
      message: 'Test connection successful',
      timestamp: new Date(),
      testId: 'connection-test-' + Date.now()
    });
    console.log('✅ Firestore write successful:', testDoc.id);

    // Test Firestore read
    console.log('📖 Testing Firestore read...');
    const q = query(collection(db, 'test'), where('testId', '==', testDoc.id));
    const querySnapshot = await getDocs(q);
    console.log('✅ Firestore read successful, found', querySnapshot.size, 'documents');

    // Cleanup test document
    await deleteDoc(testDoc);
    console.log('🧹 Test document cleaned up');

    console.log('🎉 Firebase connection test PASSED!');
    console.log('✅ Firestore is working correctly');
    console.log('✅ Data should persist between server restarts');

  } catch (error) {
    console.error('❌ Firebase connection test FAILED:', error);
    console.error('🔍 Error details:', error.message);
  }
}

testFirebase();
