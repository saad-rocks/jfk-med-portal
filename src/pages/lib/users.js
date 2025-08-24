"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = getAllUsers;
exports.getUsersByRole = getUsersByRole;
exports.getUserById = getUserById;
exports.getUserByUid = getUserByUid;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUserProfile = deleteUserProfile;
exports.searchUsers = searchUsers;
exports.getUserStats = getUserStats;
exports.batchUpdateUsers = batchUpdateUsers;
var firestore_1 = require("firebase/firestore");
var auth_1 = require("firebase/auth");
var firebase_1 = require("../firebase");
var USERS_COLLECTION = 'users';
// Get all users
function getAllUsers() {
    return __awaiter(this, void 0, void 0, function () {
        var usersRef, q, querySnapshot, users, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log('🔍 Fetching all users from Firestore...');
                    usersRef = (0, firestore_1.collection)(firebase_1.db, USERS_COLLECTION);
                    q = (0, firestore_1.query)(usersRef, (0, firestore_1.orderBy)('createdAt', 'desc'));
                    return [4 /*yield*/, (0, firestore_1.getDocs)(q)];
                case 1:
                    querySnapshot = _a.sent();
                    users = querySnapshot.docs.map(function (doc) { return (__assign({ id: doc.id }, doc.data())); });
                    console.log("\u2705 Fetched ".concat(users.length, " users from Firestore:"), users);
                    return [2 /*return*/, users];
                case 2:
                    error_1 = _a.sent();
                    console.error('❌ Error fetching users:', error_1);
                    throw new Error('Failed to fetch users');
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Get users by role
function getUsersByRole(role) {
    return __awaiter(this, void 0, void 0, function () {
        var usersRef, q, querySnapshot, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    usersRef = (0, firestore_1.collection)(firebase_1.db, USERS_COLLECTION);
                    q = (0, firestore_1.query)(usersRef, (0, firestore_1.where)('role', '==', role), (0, firestore_1.orderBy)('createdAt', 'desc'));
                    return [4 /*yield*/, (0, firestore_1.getDocs)(q)];
                case 1:
                    querySnapshot = _a.sent();
                    return [2 /*return*/, querySnapshot.docs.map(function (doc) { return (__assign({ id: doc.id }, doc.data())); })];
                case 2:
                    error_2 = _a.sent();
                    console.error("Error fetching ".concat(role, "s:"), error_2);
                    throw new Error("Failed to fetch ".concat(role, "s"));
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Get user by ID
function getUserById(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var userRef, userSnap, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userRef = (0, firestore_1.doc)(firebase_1.db, USERS_COLLECTION, userId);
                    return [4 /*yield*/, (0, firestore_1.getDoc)(userRef)];
                case 1:
                    userSnap = _a.sent();
                    if (userSnap.exists()) {
                        return [2 /*return*/, __assign({ id: userSnap.id }, userSnap.data())];
                    }
                    return [2 /*return*/, null];
                case 2:
                    error_3 = _a.sent();
                    console.error('Error fetching user:', error_3);
                    throw new Error('Failed to fetch user');
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Get user by Firebase Auth UID
function getUserByUid(uid) {
    return __awaiter(this, void 0, void 0, function () {
        var usersRef, q, querySnapshot, doc_1, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    usersRef = (0, firestore_1.collection)(firebase_1.db, USERS_COLLECTION);
                    q = (0, firestore_1.query)(usersRef, (0, firestore_1.where)('uid', '==', uid));
                    return [4 /*yield*/, (0, firestore_1.getDocs)(q)];
                case 1:
                    querySnapshot = _a.sent();
                    if (!querySnapshot.empty) {
                        doc_1 = querySnapshot.docs[0];
                        return [2 /*return*/, __assign({ id: doc_1.id }, doc_1.data())];
                    }
                    return [2 /*return*/, null];
                case 2:
                    error_4 = _a.sent();
                    console.error('Error fetching user by UID:', error_4);
                    throw new Error('Failed to fetch user by UID');
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Create new user (with Firebase Auth + Firestore profile)
function createUser(userData) {
    return __awaiter(this, void 0, void 0, function () {
        var userCredential, firebaseUser, userProfile, docRef, newUser, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    console.log('👤 Creating new user:', userData);
                    // Validate input data
                    if (!userData.email) {
                        throw new Error('Email is required');
                    }
                    if (!userData.password) {
                        throw new Error('Password is required');
                    }
                    if (!userData.name) {
                        throw new Error('Name is required');
                    }
                    if (userData.password.length < 6) {
                        throw new Error('Password must be at least 6 characters long');
                    }
                    console.log('✅ Input validation passed');
                    // Create Firebase Auth user
                    console.log('🔐 Creating Firebase Auth user...');
                    console.log('📧 Email:', userData.email);
                    console.log('🔑 Password length:', userData.password.length);
                    return [4 /*yield*/, (0, auth_1.createUserWithEmailAndPassword)(firebase_1.auth, userData.email, userData.password)];
                case 1:
                    userCredential = _a.sent();
                    firebaseUser = userCredential.user;
                    console.log('✅ Firebase Auth user created:', firebaseUser.uid);
                    // Update Firebase Auth profile
                    return [4 /*yield*/, (0, auth_1.updateProfile)(firebaseUser, {
                            displayName: userData.name
                        })];
                case 2:
                    // Update Firebase Auth profile
                    _a.sent();
                    console.log('✅ Firebase Auth profile updated');
                    userProfile = {
                        uid: firebaseUser.uid,
                        name: userData.name,
                        email: userData.email,
                        phone: userData.phone,
                        role: userData.role,
                        status: 'active',
                        createdAt: firestore_1.Timestamp.now(),
                        updatedAt: firestore_1.Timestamp.now(),
                    };
                    // Add role-specific fields
                    if (userData.role === 'student') {
                        userProfile.mdYear = userData.mdYear || 'MD-1';
                        userProfile.studentId = userData.studentId || generateStudentId();
                        userProfile.gpa = userData.gpa || 0;
                        userProfile.enrollmentDate = firestore_1.Timestamp.now();
                        console.log('📚 Added student-specific fields');
                    }
                    else if (userData.role === 'teacher') {
                        userProfile.department = userData.department;
                        userProfile.specialization = userData.specialization;
                        userProfile.employeeId = userData.employeeId || generateEmployeeId();
                        userProfile.hireDate = firestore_1.Timestamp.now();
                        console.log('👨‍🏫 Added teacher-specific fields');
                    }
                    else if (userData.role === 'admin') {
                        userProfile.adminLevel = userData.adminLevel || 'regular';
                        userProfile.permissions = userData.permissions || ['user_management'];
                        console.log('🛡️ Added admin-specific fields');
                    }
                    console.log('💾 Saving user profile to Firestore:', userProfile);
                    return [4 /*yield*/, (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, USERS_COLLECTION), userProfile)];
                case 3:
                    docRef = _a.sent();
                    console.log('✅ User profile saved to Firestore:', docRef.id);
                    newUser = __assign({ id: docRef.id }, userProfile);
                    console.log('🎉 User creation completed:', newUser);
                    return [2 /*return*/, newUser];
                case 4:
                    error_5 = _a.sent();
                    console.error('❌ Error creating user:', error_5);
                    throw new Error('Failed to create user: ' + error_5.message);
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Update user
function updateUser(userId, updates) {
    return __awaiter(this, void 0, void 0, function () {
        var userRef, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userRef = (0, firestore_1.doc)(firebase_1.db, USERS_COLLECTION, userId);
                    return [4 /*yield*/, (0, firestore_1.updateDoc)(userRef, __assign(__assign({}, updates), { updatedAt: firestore_1.Timestamp.now() }))];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_6 = _a.sent();
                    console.error('Error updating user:', error_6);
                    throw new Error('Failed to update user');
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Delete user (Firestore profile only - Firebase Auth deletion requires admin SDK)
function deleteUserProfile(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var userRef, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userRef = (0, firestore_1.doc)(firebase_1.db, USERS_COLLECTION, userId);
                    return [4 /*yield*/, (0, firestore_1.deleteDoc)(userRef)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_7 = _a.sent();
                    console.error('Error deleting user profile:', error_7);
                    throw new Error('Failed to delete user profile');
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Search users
function searchUsers(searchTerm, role) {
    return __awaiter(this, void 0, void 0, function () {
        var q, usersRef, querySnapshot, users, lowercaseSearch_1, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    q = void 0;
                    usersRef = (0, firestore_1.collection)(firebase_1.db, USERS_COLLECTION);
                    if (role) {
                        q = (0, firestore_1.query)(usersRef, (0, firestore_1.where)('role', '==', role));
                    }
                    else {
                        q = (0, firestore_1.query)(usersRef, (0, firestore_1.orderBy)('createdAt', 'desc'));
                    }
                    return [4 /*yield*/, (0, firestore_1.getDocs)(q)];
                case 1:
                    querySnapshot = _a.sent();
                    users = querySnapshot.docs.map(function (doc) { return (__assign({ id: doc.id }, doc.data())); });
                    // Client-side filtering for search term (Firestore doesn't support full-text search)
                    if (searchTerm) {
                        lowercaseSearch_1 = searchTerm.toLowerCase();
                        return [2 /*return*/, users.filter(function (user) {
                                return user.name.toLowerCase().includes(lowercaseSearch_1) ||
                                    user.email.toLowerCase().includes(lowercaseSearch_1) ||
                                    (user.studentId && user.studentId.toLowerCase().includes(lowercaseSearch_1)) ||
                                    (user.employeeId && user.employeeId.toLowerCase().includes(lowercaseSearch_1));
                            })];
                    }
                    return [2 /*return*/, users];
                case 2:
                    error_8 = _a.sent();
                    console.error('Error searching users:', error_8);
                    throw new Error('Failed to search users');
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Get user statistics
function getUserStats() {
    return __awaiter(this, void 0, void 0, function () {
        var users, error_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getAllUsers()];
                case 1:
                    users = _a.sent();
                    return [2 /*return*/, {
                            totalUsers: users.length,
                            students: users.filter(function (u) { return u.role === 'student'; }).length,
                            teachers: users.filter(function (u) { return u.role === 'teacher'; }).length,
                            admins: users.filter(function (u) { return u.role === 'admin'; }).length,
                            activeUsers: users.filter(function (u) { return u.status === 'active'; }).length,
                        }];
                case 2:
                    error_9 = _a.sent();
                    console.error('Error getting user stats:', error_9);
                    throw new Error('Failed to get user statistics');
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Helper functions
function generateStudentId() {
    var year = new Date().getFullYear();
    var randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return "JFK".concat(year).concat(randomNum);
}
function generateEmployeeId() {
    var randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return "JFK-FAC-".concat(randomNum);
}
// Batch operations for bulk user management
function batchUpdateUsers(updates) {
    return __awaiter(this, void 0, void 0, function () {
        var batch_1, error_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    batch_1 = (0, firestore_1.writeBatch)(firebase_1.db);
                    updates.forEach(function (_a) {
                        var id = _a.id, data = _a.data;
                        var userRef = (0, firestore_1.doc)(firebase_1.db, USERS_COLLECTION, id);
                        batch_1.update(userRef, __assign(__assign({}, data), { updatedAt: firestore_1.Timestamp.now() }));
                    });
                    return [4 /*yield*/, batch_1.commit()];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_10 = _a.sent();
                    console.error('Error batch updating users:', error_10);
                    throw new Error('Failed to batch update users');
                case 3: return [2 /*return*/];
            }
        });
    });
}
