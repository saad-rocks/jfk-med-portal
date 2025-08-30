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

// Connect to emulators if in development mode
if (import.meta.env.DEV) {
  // Connect to available emulators only
  import('firebase/firestore').then(({ connectFirestoreEmulator }) => {
    try {
      connectFirestoreEmulator(db, '127.0.0.1', 8080);
    } catch (error) {
      console.warn('Firestore emulator already connected or not available:', error);
    }
  });

  import('firebase/functions').then(({ connectFunctionsEmulator }) => {
    try {
      connectFunctionsEmulator(functions, '127.0.0.1', 5001);
    } catch (error) {
      console.warn('Functions emulator already connected or not available:', error);
    }
  });

  import('firebase/storage').then(({ connectStorageEmulator }) => {
    try {
      connectStorageEmulator(storage, '127.0.0.1', 9199);
    } catch (error) {
      console.warn('Storage emulator already connected or not available:', error);
    }
  });

  // Note: Auth emulator is not running, so we'll use production Auth
  // but Functions will still work with emulator since they're connected
}

// Enable persistence for offline support (only in production)
if (typeof window !== 'undefined' && !import.meta.env.DEV) {
  // Only run in browser environment and production
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
