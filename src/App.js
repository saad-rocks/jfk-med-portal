import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Clean App.tsx file - recreating from scratch
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState, Suspense, lazy } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import AppShell from "./layouts/AppShell";
class AppErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        console.error('❌ Error Boundary triggered:', error);
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('❌ App Error Boundary caught an error:', error, errorInfo);
    }
    render() {
        if (this.state.hasError && this.state.error) {
            return (_jsx("div", { style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    backgroundColor: '#f9fafb',
                    padding: '20px'
                }, children: _jsxs("div", { style: {
                        textAlign: 'center',
                        maxWidth: '600px',
                        backgroundColor: 'white',
                        padding: '40px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }, children: [_jsx("h1", { style: { fontSize: '24px', fontWeight: 'bold', color: '#dc2626', marginBottom: '16px' }, children: "Application Error" }), _jsx("p", { style: { color: '#6b7280', marginBottom: '16px' }, children: "Something went wrong while loading the application." }), _jsxs("div", { style: {
                                backgroundColor: '#fef2f2',
                                padding: '16px',
                                borderRadius: '4px',
                                border: '1px solid #fecaca',
                                textAlign: 'left',
                                marginBottom: '16px'
                            }, children: [_jsx("div", { style: { fontWeight: 'medium', color: '#dc2626', marginBottom: '8px' }, children: "Error Details:" }), _jsx("pre", { style: {
                                        fontSize: '14px',
                                        color: '#dc2626',
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word'
                                    }, children: this.state.error.toString() })] }), _jsx("button", { onClick: () => window.location.reload(), style: {
                                backgroundColor: '#2563eb',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 'medium'
                            }, children: "Reload Page" })] }) }));
        }
        return this.props.children;
    }
}
// Loading fallback component
function PageLoader() {
    return (_jsx("div", { className: "flex items-center justify-center min-h-[400px]", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" }), _jsx("span", { className: "text-gray-600", children: "Loading..." })] }) }));
}
// Lazy load pages for better performance
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Courses = lazy(() => import("./pages/Courses"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const Enrollments = lazy(() => import("./pages/Enrollments"));
const ManageUsers = lazy(() => import("./pages/ManageUsers"));
const AssignmentsTeacher = lazy(() => import("./pages/AssignmentsTeacher"));
const AssignmentsStudent = lazy(() => import("./pages/AssignmentsStudent"));
const GradeSubmissions = lazy(() => import("./pages/GradeSubmissions"));
const Attendance = lazy(() => import("./pages/Attendance"));
const Gradebook = lazy(() => import("./pages/Gradebook"));
const Announcements = lazy(() => import("./pages/Announcements"));
const Semesters = lazy(() => import("./pages/Semesters"));
const Settings = lazy(() => import("./pages/Settings"));
const UsersAdmin = lazy(() => import("./pages/UsersAdmin"));
const OSCE = lazy(() => import("./pages/OSCE"));
const ClinicalRotations = lazy(() => import("./pages/ClinicalRotations"));
const Immunizations = lazy(() => import("./pages/Immunizations"));
function AuthGate({ children }) {
    const [user, setUser] = useState("loading");
    useEffect(() => onAuthStateChanged(auth, u => setUser(u ?? null)), []);
    if (user === "loading")
        return _jsx(PageLoader, {});
    return user ? children : _jsx(Navigate, { to: "/login", replace: true });
}
function AdminOnly() {
    return _jsx("div", { className: "p-6", children: "Admin area (we'll guard by custom claim next)" });
}
function App() {
    return (_jsx(BrowserRouter, { children: _jsx(Suspense, { fallback: _jsx(PageLoader, {}), children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsxs(Route, { path: "/", element: _jsx(AuthGate, { children: _jsx(AppShell, {}) }), children: [_jsx(Route, { index: true, element: _jsx(Suspense, { fallback: _jsx(PageLoader, {}), children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: "courses", element: _jsx(Suspense, { fallback: _jsx(PageLoader, {}), children: _jsx(Courses, {}) }) }), _jsx(Route, { path: "courses/:courseId", element: _jsx(Suspense, { fallback: _jsx(PageLoader, {}), children: _jsx(CourseDetail, {}) }) }), _jsx(Route, { path: "courses/:courseId/assignments/teacher", element: _jsx(Suspense, { fallback: _jsx(PageLoader, {}), children: _jsx(AssignmentsTeacher, {}) }) }), _jsx(Route, { path: "courses/:courseId/assignments", element: _jsx(Suspense, { fallback: _jsx(PageLoader, {}), children: _jsx(AssignmentsStudent, {}) }) }), _jsx(Route, { path: "assignments/:assignmentId/grade", element: _jsx(Suspense, { fallback: _jsx(PageLoader, {}), children: _jsx(GradeSubmissions, {}) }) }), _jsx(Route, { path: "enrollments", element: _jsx(Suspense, { fallback: _jsx(PageLoader, {}), children: _jsx(Enrollments, {}) }) }), _jsx(Route, { path: "manage-users", element: _jsx(Suspense, { fallback: _jsx(PageLoader, {}), children: _jsx(ManageUsers, {}) }) }), _jsx(Route, { path: "attendance", element: _jsx(Suspense, { fallback: _jsx(PageLoader, {}), children: _jsx(Attendance, {}) }) }), _jsx(Route, { path: "gradebook", element: _jsx(Suspense, { fallback: _jsx(PageLoader, {}), children: _jsx(Gradebook, {}) }) }), _jsx(Route, { path: "announcements", element: _jsx(Suspense, { fallback: _jsx(PageLoader, {}), children: _jsx(Announcements, {}) }) }), _jsx(Route, { path: "semesters", element: _jsx(Suspense, { fallback: _jsx(PageLoader, {}), children: _jsx(Semesters, {}) }) }), _jsx(Route, { path: "settings", element: _jsx(Suspense, { fallback: _jsx(PageLoader, {}), children: _jsx(Settings, {}) }) }), _jsx(Route, { path: "admin", element: _jsx(AdminOnly, {}) }), _jsx(Route, { path: "osce", element: _jsx(Suspense, { fallback: _jsx(PageLoader, {}), children: _jsx(OSCE, {}) }) }), _jsx(Route, { path: "clinical", element: _jsx(Suspense, { fallback: _jsx(PageLoader, {}), children: _jsx(ClinicalRotations, {}) }) }), _jsx(Route, { path: "immunizations", element: _jsx(Suspense, { fallback: _jsx(PageLoader, {}), children: _jsx(Immunizations, {}) }) })] }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }) }));
}
// Export the App component with error boundary
const AppWithErrorBoundary = () => (_jsx(AppErrorBoundary, { children: _jsx(App, {}) }));
export default AppWithErrorBoundary;
