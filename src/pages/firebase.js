"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.functions = exports.storage = exports.db = exports.auth = void 0;
var app_1 = require("firebase/app");
var auth_1 = require("firebase/auth");
var firestore_1 = require("firebase/firestore");
var storage_1 = require("firebase/storage");
var functions_1 = require("firebase/functions");
var firebaseConfig = {
    apiKey: "AIzaSyDIERzEuMgxiMZ1oViMTh9Xy4Glw8YceUA",
    authDomain: "jfk-med-portal.firebaseapp.com",
    projectId: "jfk-med-portal",
    storageBucket: "jfk-med-portal.firebasestorage.app",
    messagingSenderId: "340149930069",
    appId: "1:340149930069:web:ae2107d24398edaf0bacdc",
    measurementId: "G-BVZC2T1VZZ"
};
var app = (0, app_1.initializeApp)(firebaseConfig);
exports.auth = (0, auth_1.getAuth)(app);
exports.db = (0, firestore_1.getFirestore)(app);
exports.storage = (0, storage_1.getStorage)(app);
exports.functions = (0, functions_1.getFunctions)(app);
