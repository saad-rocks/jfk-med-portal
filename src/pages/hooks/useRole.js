"use strict";
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
exports.useRole = useRole;
var react_1 = require("react");
var auth_1 = require("firebase/auth");
var firebase_1 = require("../firebase");
function useRole() {
    var _this = this;
    var _a = (0, react_1.useState)(null), user = _a[0], setUser = _a[1];
    var _b = (0, react_1.useState)(undefined), role = _b[0], setRole = _b[1];
    var _c = (0, react_1.useState)(undefined), mdYear = _c[0], setMdYear = _c[1];
    var _d = (0, react_1.useState)(true), loading = _d[0], setLoading = _d[1];
    (0, react_1.useEffect)(function () {
        var unsub = (0, auth_1.onAuthStateChanged)(firebase_1.auth, function (u) { return __awaiter(_this, void 0, void 0, function () {
            var claims, _a;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        setUser(u);
                        if (!u) return [3 /*break*/, 6];
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, u.getIdToken(true)];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, u.getIdTokenResult()];
                    case 3:
                        claims = (_d.sent()).claims;
                        // Temporary admin override for demo - remove this in production
                        // TODO: Replace with your actual admin email
                        if (u.email === 'admin@jfkmedical.edu' || u.email === 'admin@jfk.edu' || u.email === 'admin@test.com' || ((_b = u.email) === null || _b === void 0 ? void 0 : _b.includes('admin'))) {
                            setRole('admin');
                            console.log('👑 Admin role set for:', u.email);
                        }
                        else if (claims === null || claims === void 0 ? void 0 : claims.role) {
                            setRole(claims.role);
                        }
                        else {
                            setRole('student');
                            console.log('👨‍🎓 Student role set for:', u.email);
                        }
                        // Debug: Log all user info to help identify your users
                        console.log('🔍 User Info:', {
                            email: u.email,
                            uid: u.uid,
                            displayName: u.displayName,
                            role: u.email === 'admin@jfkmedical.edu' || u.email === 'admin@jfk.edu' || u.email === 'admin@test.com' || ((_c = u.email) === null || _c === void 0 ? void 0 : _c.includes('admin')) ? 'admin' : 'student'
                        });
                        // Extract MD year from claims or derive from enrollment date
                        if (claims === null || claims === void 0 ? void 0 : claims.mdYear) {
                            setMdYear(claims.mdYear);
                        }
                        else {
                            // Default to MD-1 for demo purposes - you can change this
                            setMdYear("MD-1");
                            console.log('🎓 MD Year set to:', "MD-1", 'for user:', u.email);
                            // Optional: Use account creation date logic if you want variety
                            // const currentYear = new Date().getFullYear();
                            // const userCreationYear = u.metadata.creationTime 
                            //   ? new Date(u.metadata.creationTime).getFullYear()
                            //   : currentYear;
                            // const yearsSinceEnrollment = currentYear - userCreationYear;
                            // if (yearsSinceEnrollment <= 0) setMdYear("MD-1");
                            // else if (yearsSinceEnrollment === 1) setMdYear("MD-2");
                            // else if (yearsSinceEnrollment === 2) setMdYear("MD-3");
                            // else setMdYear("MD-4");
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        _a = _d.sent();
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        setRole(undefined);
                        setMdYear(undefined);
                        _d.label = 7;
                    case 7:
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        }); });
        return function () { return unsub(); };
    }, []);
    return { user: user, role: role, mdYear: mdYear, loading: loading };
}
