import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDIERzEuMgxiMZ1oViMTh9Xy4Glw8YceUA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "jfk-med-portal.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "jfk-med-portal",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "jfk-med-portal.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "340149930069",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:340149930069:web:ae2107d24398edaf0bacdc",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-BVZC2T1VZZ"
};

// Validate required configuration
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error("Firebase configuration is incomplete. Please check your environment variables.");
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Use Firebase emulators in development (only if explicitly enabled)
const useEmulators = import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true';

if (useEmulators && import.meta.env.DEV) {
  console.log('🔥 Using Firebase emulators in development mode');

  // Connect to emulators
  import('firebase/auth').then(({ connectAuthEmulator }) => {
    connectAuthEmulator(auth, "http://localhost:9099");
  });

  import('firebase/firestore').then(({ connectFirestoreEmulator }) => {
    connectFirestoreEmulator(db, 'localhost', 8080);
  });

  import('firebase/storage').then(({ connectStorageEmulator }) => {
    connectStorageEmulator(storage, 'localhost', 9199);
  });

  import('firebase/functions').then(({ connectFunctionsEmulator }) => {
    connectFunctionsEmulator(functions, 'localhost', 5001);
  });
} else {
  // Using production Firebase (no console log to reduce noise)
  // Enable offline persistence for production
  if (typeof window !== 'undefined') {
    import('firebase/firestore').then(({ enableIndexedDbPersistence }) => {
      enableIndexedDbPersistence(db).catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code === 'unimplemented') {
          console.warn('The current browser does not support persistence.');
        }
      });
    });
  }
}
