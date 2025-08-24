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
exports.default = Enrollments;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var functions_1 = require("firebase/functions");
var firebase_1 = require("../firebase");
var enrollments_1 = require("../lib/enrollments");
var courses_1 = require("../lib/courses");
var users_1 = require("../lib/users");
var PageHeader_1 = require("../components/layout/PageHeader");
var PageActions_1 = require("../components/layout/PageActions");
var button_1 = require("../components/ui/button");
var input_1 = require("../components/ui/input");
var card_1 = require("../components/ui/card");
var useRole_1 = require("../hooks/useRole");
var SEMESTERS = Array.from({ length: 11 }, function (_, i) { return "MD-".concat(i + 1); });
var STATUSES = ["enrolled", "dropped", "completed"];
function Enrollments() {
    var _this = this;
    var _a = (0, useRole_1.useRole)(), user = _a.user, role = _a.role, loading = _a.loading;
    var _b = (0, react_1.useState)(null), error = _b[0], setError = _b[1];
    var _c = (0, react_1.useState)([]), courses = _c[0], setCourses = _c[1];
    var _d = (0, react_1.useState)([]), users = _d[0], setUsers = _d[1];
    var _e = (0, react_1.useState)([]), enrollments = _e[0], setEnrollments = _e[1];
    var _f = (0, react_1.useState)(""), studentSearch = _f[0], setStudentSearch = _f[1];
    var _g = (0, react_1.useState)(""), selectedStudentId = _g[0], setSelectedStudentId = _g[1];
    var _h = (0, react_1.useState)(""), selectedCourseId = _h[0], setSelectedCourseId = _h[1];
    var _j = (0, react_1.useState)("MD-1"), selectedSemesterId = _j[0], setSelectedSemesterId = _j[1];
    var _k = (0, react_1.useState)("enrolled"), createStatus = _k[0], setCreateStatus = _k[1];
    var _l = (0, react_1.useState)(false), isSubmitting = _l[0], setIsSubmitting = _l[1];
    var _m = (0, react_1.useState)(""), filterCourseId = _m[0], setFilterCourseId = _m[1];
    var _o = (0, react_1.useState)(""), filterSemesterId = _o[0], setFilterSemesterId = _o[1];
    var isAdmin = role === "admin";
    // Create lookup maps for quick name retrieval - with safe fallbacks
    var studentNameMap = (users || []).reduce(function (map, user) {
        if (user && user.uid && user.name) {
            map[user.uid] = user.name;
        }
        return map;
    }, {});
    var courseNameMap = (courses || []).reduce(function (map, course) {
        if (course && course.id && course.code && course.title) {
            map[course.id] = "".concat(course.code, " - ").concat(course.title);
        }
        return map;
    }, {});
    // Debug logging - wrapped in try-catch to prevent crashes
    try {
        console.log('🔍 Debug Info:', {
            usersCount: users.length,
            coursesCount: courses.length,
            enrollmentsCount: enrollments.length,
            sampleStudentMap: Object.keys(studentNameMap).slice(0, 3),
            sampleCourseMap: Object.keys(courseNameMap).slice(0, 3),
            sampleEnrollment: enrollments[0]
        });
    }
    catch (debugError) {
        console.error('Debug logging error:', debugError);
    }
    (0, react_1.useEffect)(function () {
        if (!loading) {
            (function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, cs, us, es, e_1;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 2, , 3]);
                            console.log('🚀 Starting to load data...');
                            return [4 /*yield*/, Promise.all([
                                    (0, courses_1.listCourses)(),
                                    (0, users_1.getAllUsers)(),
                                    (0, enrollments_1.listEnrollments)({}),
                                ])];
                        case 1:
                            _a = _c.sent(), cs = _a[0], us = _a[1], es = _a[2];
                            console.log('✅ Data loaded successfully:', { courses: cs.length, users: us.length, enrollments: es.length });
                            setCourses(cs || []);
                            setUsers(us || []);
                            setEnrollments(es || []);
                            return [3 /*break*/, 3];
                        case 2:
                            e_1 = _c.sent();
                            console.error('❌ Error loading data:', e_1);
                            setError((_b = e_1 === null || e_1 === void 0 ? void 0 : e_1.message) !== null && _b !== void 0 ? _b : "Failed to load data");
                            // Set empty arrays to prevent crashes
                            setCourses([]);
                            setUsers([]);
                            setEnrollments([]);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); })();
        }
    }, [loading]);
    function handleFindStudent() {
        return __awaiter(this, void 0, void 0, function () {
            var value, callable, res, e_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        setError(null);
                        value = studentSearch.trim();
                        if (!value)
                            return [2 /*return*/];
                        if (!value.includes("@")) return [3 /*break*/, 5];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        callable = (0, functions_1.httpsCallable)(firebase_1.functions, "findUserByEmailOrUid");
                        return [4 /*yield*/, callable({ emailOrUid: value })];
                    case 2:
                        res = _b.sent();
                        setSelectedStudentId(res.data.uid);
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _b.sent();
                        setError((_a = e_2 === null || e_2 === void 0 ? void 0 : e_2.message) !== null && _a !== void 0 ? _a : "User not found");
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        setSelectedStudentId(value);
                        _b.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    function handleCreateEnrollment(e) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, es, us, e_3;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        e.preventDefault();
                        if (!isAdmin || isSubmitting)
                            return [2 /*return*/];
                        if (!selectedStudentId || !selectedCourseId) {
                            setError("Please select both a student and a course");
                            return [2 /*return*/];
                        }
                        setError(null);
                        setIsSubmitting(true);
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 4, 5, 6]);
                        return [4 /*yield*/, (0, enrollments_1.createEnrollment)({
                                studentId: selectedStudentId,
                                courseId: selectedCourseId,
                                semesterId: selectedSemesterId,
                                status: createStatus,
                            })];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, Promise.all([
                                (0, enrollments_1.listEnrollments)({ courseId: filterCourseId || undefined, semesterId: filterSemesterId || undefined }),
                                (0, users_1.getAllUsers)()
                            ])];
                    case 3:
                        _a = _c.sent(), es = _a[0], us = _a[1];
                        setEnrollments(es);
                        setUsers(us);
                        setSelectedCourseId("");
                        setSelectedSemesterId("MD-1");
                        setCreateStatus("enrolled");
                        setSelectedStudentId("");
                        setStudentSearch("");
                        return [3 /*break*/, 6];
                    case 4:
                        e_3 = _c.sent();
                        setError((_b = e_3 === null || e_3 === void 0 ? void 0 : e_3.message) !== null && _b !== void 0 ? _b : "Failed to create enrollment");
                        return [3 /*break*/, 6];
                    case 5:
                        setIsSubmitting(false);
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    function handleUpdateStatus(id, status) {
        return __awaiter(this, void 0, void 0, function () {
            var es, e_4;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, enrollments_1.updateEnrollmentStatus)(id, status)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (0, enrollments_1.listEnrollments)({ courseId: filterCourseId || undefined, semesterId: filterSemesterId || undefined })];
                    case 2:
                        es = _b.sent();
                        setEnrollments(es);
                        return [3 /*break*/, 4];
                    case 3:
                        e_4 = _b.sent();
                        setError((_a = e_4 === null || e_4 === void 0 ? void 0 : e_4.message) !== null && _a !== void 0 ? _a : "Failed to update status");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function handleDelete(id) {
        return __awaiter(this, void 0, void 0, function () {
            var es, e_5;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, enrollments_1.deleteEnrollment)(id)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (0, enrollments_1.listEnrollments)({ courseId: filterCourseId || undefined, semesterId: filterSemesterId || undefined })];
                    case 2:
                        es = _b.sent();
                        setEnrollments(es);
                        return [3 /*break*/, 4];
                    case 3:
                        e_5 = _b.sent();
                        setError((_a = e_5 === null || e_5 === void 0 ? void 0 : e_5.message) !== null && _a !== void 0 ? _a : "Failed to delete enrollment");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function applyFilters() {
        return __awaiter(this, void 0, void 0, function () {
            var es;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, enrollments_1.listEnrollments)({ courseId: filterCourseId || undefined, semesterId: filterSemesterId || undefined })];
                    case 1:
                        es = _a.sent();
                        setEnrollments(es);
                        return [2 /*return*/];
                }
            });
        });
    }
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center min-h-[400px]", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "Loading enrollments..." })] }) }));
    }
    // Error boundary for rendering issues
    try {
        if (!isAdmin) {
            return ((0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-4", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-8 h-8 text-red-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" }) }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-800 mb-2", children: "Access Denied" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "You need admin privileges to access the enrollments page." })] }) }));
        }
        return ((0, jsx_runtime_1.jsxs)("div", { className: "p-6 max-w-5xl mx-auto", children: [(0, jsx_runtime_1.jsx)(PageHeader_1.PageHeader, { title: "Enrollments", breadcrumb: [{ label: 'Home', to: '/' }, { label: 'Enrollments' }], actions: (0, jsx_runtime_1.jsx)(PageActions_1.PageActions, { children: (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", onClick: function () { var _a; return (_a = document.querySelector('#assign-form')) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' }); }, children: "Assign Student" }) }) }), error && ((0, jsx_runtime_1.jsx)("div", { className: "mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 shadow-soft", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-4 h-4 text-red-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" }) }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-semibold text-red-800", children: "Error" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-700", children: error })] })] }) })), (0, jsx_runtime_1.jsxs)(card_1.Card, { id: "assign-form", className: "mb-8", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-5 h-5 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6v6m0 0v6m0-6h6m-6 0H6" }) }) }), "Assign Student to Course"] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleCreateEnrollment, className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-slate-700", children: "Student (UID or Email)" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1", children: (0, jsx_runtime_1.jsx)(input_1.Input, { value: studentSearch, onChange: function (e) { return setStudentSearch(e.target.value); }, placeholder: "Enter student UID or email address", className: "h-12" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { type: "button", onClick: handleFindStudent, variant: "outline", size: "md", className: "h-12 px-6 whitespace-nowrap", children: "Find Student" })] }), selectedStudentId && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-green-500 rounded-full" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm font-medium text-green-700", children: ["Selected: ", selectedStudentId] })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-slate-700", children: "Course" }), (0, jsx_runtime_1.jsxs)("select", { className: "w-full h-12 border-2 border-slate-200 rounded-xl px-4 bg-white/50 backdrop-blur-sm focus:border-blue-400 focus:bg-white transition-all duration-300 hover:border-slate-300", value: selectedCourseId, onChange: function (e) { return setSelectedCourseId(e.target.value); }, children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "Select a course..." }), courses.map(function (c) { return ((0, jsx_runtime_1.jsxs)("option", { value: c.id, children: [c.code, " \u2014 ", c.title] }, c.id)); })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-slate-700", children: "Semester" }), (0, jsx_runtime_1.jsx)("select", { className: "w-full h-12 border-2 border-slate-200 rounded-xl px-4 bg-white/50 backdrop-blur-sm focus:border-blue-400 focus:bg-white transition-all duration-300 hover:border-slate-300", value: selectedSemesterId, onChange: function (e) { return setSelectedSemesterId(e.target.value); }, children: SEMESTERS.map(function (s) { return ((0, jsx_runtime_1.jsx)("option", { value: s, children: s }, s)); }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-slate-700", children: "Initial Status" }), (0, jsx_runtime_1.jsx)("select", { className: "w-full h-12 border-2 border-slate-200 rounded-xl px-4 bg-white/50 backdrop-blur-sm focus:border-blue-400 focus:bg-white transition-all duration-300 hover:border-slate-300", value: createStatus, onChange: function (e) { return setCreateStatus(e.target.value); }, children: STATUSES.map(function (s) { return ((0, jsx_runtime_1.jsx)("option", { value: s, children: s.charAt(0).toUpperCase() + s.slice(1) }, s)); }) })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex justify-end pt-4", children: (0, jsx_runtime_1.jsx)(button_1.Button, { type: "submit", variant: "primary", size: "lg", disabled: isSubmitting || !selectedStudentId || !selectedCourseId, className: "min-w-[140px]", children: isSubmitting ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }), "Assigning..."] })) : ("Assign Student") }) })] }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "mb-8", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 rounded-2xl bg-gradient-to-r from-slate-500 to-slate-600 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-5 h-5 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" }) }) }), "Filter Enrollments"] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-slate-700", children: "Course" }), (0, jsx_runtime_1.jsxs)("select", { className: "w-full h-12 border-2 border-slate-200 rounded-xl px-4 bg-white/50 backdrop-blur-sm focus:border-blue-400 focus:bg-white transition-all duration-300 hover:border-slate-300", value: filterCourseId, onChange: function (e) { return setFilterCourseId(e.target.value); }, children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "All Courses" }), courses.map(function (c) { return ((0, jsx_runtime_1.jsxs)("option", { value: c.id, children: [c.code, " \u2014 ", c.title] }, c.id)); })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-slate-700", children: "Semester" }), (0, jsx_runtime_1.jsxs)("select", { className: "w-full h-12 border-2 border-slate-200 rounded-xl px-4 bg-white/50 backdrop-blur-sm focus:border-blue-400 focus:bg-white transition-all duration-300 hover:border-slate-300", value: filterSemesterId, onChange: function (e) { return setFilterSemesterId(e.target.value); }, children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "All Semesters" }), SEMESTERS.map(function (s) { return ((0, jsx_runtime_1.jsx)("option", { value: s, children: s }, s)); })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-end", children: (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: applyFilters, variant: "outline", size: "lg", className: "w-full h-12", children: "Apply Filters" }) })] }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-5 h-5 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" }) }) }), "All Enrollments", (0, jsx_runtime_1.jsxs)("div", { className: "ml-auto px-3 py-1 bg-slate-100 rounded-full text-sm font-medium text-slate-600", children: [enrollments.length, " total"] })] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: enrollments.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-8 h-8 text-slate-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" }) }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-slate-800 mb-2", children: "No enrollments found" }), (0, jsx_runtime_1.jsx)("p", { className: "text-slate-600 mb-4", children: "Get started by assigning a student to a course above." })] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "hidden lg:block overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { className: "border-b border-slate-200", children: [(0, jsx_runtime_1.jsx)("th", { className: "text-left py-4 px-4 font-semibold text-slate-700", children: "Student" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-4 px-4 font-semibold text-slate-700", children: "Course" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-4 px-4 font-semibold text-slate-700", children: "Semester" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-4 px-4 font-semibold text-slate-700", children: "Status" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-4 px-4 font-semibold text-slate-700", children: "Actions" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: enrollments.map(function (e) { return ((0, jsx_runtime_1.jsxs)("tr", { className: "border-b border-slate-100 hover:bg-slate-50 transition-colors", children: [(0, jsx_runtime_1.jsx)("td", { className: "py-4 px-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-slate-800", children: studentNameMap[e.studentId] || 'Unknown Student' }), (0, jsx_runtime_1.jsx)("div", { className: "font-mono text-xs text-slate-500", children: e.studentId })] }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-4 px-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-slate-800", children: courseNameMap[e.courseId] || 'Unknown Course' }), (0, jsx_runtime_1.jsx)("div", { className: "font-mono text-xs text-slate-500", children: e.courseId })] }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-4 px-4", children: (0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800", children: e.semesterId }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-4 px-4", children: (0, jsx_runtime_1.jsx)("select", { className: "h-9 border-2 border-slate-200 rounded-lg px-3 bg-white focus:border-blue-400 transition-colors text-sm", value: e.status, onChange: function (ev) { return handleUpdateStatus(e.id, ev.target.value); }, children: STATUSES.map(function (s) { return ((0, jsx_runtime_1.jsx)("option", { value: s, children: s.charAt(0).toUpperCase() + s.slice(1) }, s)); }) }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-4 px-4", children: (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: function () { return handleDelete(e.id); }, variant: "danger", size: "sm", className: "h-9", children: "Delete" }) })] }, e.id)); }) })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "lg:hidden space-y-4", children: enrollments.map(function (e) { return ((0, jsx_runtime_1.jsx)("div", { className: "border border-slate-200 rounded-2xl p-4 bg-white shadow-soft", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-start", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs font-medium text-slate-500 mb-1", children: "Student" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-slate-800", children: studentNameMap[e.studentId] || 'Unknown Student' }), (0, jsx_runtime_1.jsx)("div", { className: "font-mono text-xs text-slate-500", children: e.studentId })] })] }), (0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800", children: e.semesterId })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs font-medium text-slate-500 mb-1", children: "Course" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-slate-800", children: courseNameMap[e.courseId] || 'Unknown Course' }), (0, jsx_runtime_1.jsx)("div", { className: "font-mono text-xs text-slate-500", children: e.courseId })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3 pt-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs font-medium text-slate-500 mb-2", children: "Status" }), (0, jsx_runtime_1.jsx)("select", { className: "w-full h-10 border-2 border-slate-200 rounded-lg px-3 bg-white focus:border-blue-400 transition-colors text-sm", value: e.status, onChange: function (ev) { return handleUpdateStatus(e.id, ev.target.value); }, children: STATUSES.map(function (s) { return ((0, jsx_runtime_1.jsx)("option", { value: s, children: s.charAt(0).toUpperCase() + s.slice(1) }, s)); }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-end", children: (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: function () { return handleDelete(e.id); }, variant: "danger", size: "sm", className: "h-10 px-4", children: "Delete" }) })] })] }) }, e.id)); }) })] })) })] })] }));
    }
    catch (renderError) {
        console.error('❌ Enrollment component render error:', renderError);
        return ((0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-4", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-8 h-8 text-red-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" }) }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-800 mb-2", children: "Something went wrong" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 mb-4", children: "There was an error loading the enrollments page." }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return window.location.reload(); }, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700", children: "Reload Page" })] }) }));
    }
}
