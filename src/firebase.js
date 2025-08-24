import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
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
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
