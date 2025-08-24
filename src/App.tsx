// Clean App.tsx file - recreating from scratch
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState, Suspense, lazy } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "./firebase";
import AppShell from "./layouts/AppShell";

// Global Error Boundary
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class AppErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error('❌ Error Boundary triggered:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('❌ App Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#f9fafb',
          padding: '20px'
        }}>
          <div style={{
            textAlign: 'center',
            maxWidth: '600px',
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626', marginBottom: '16px' }}>
              Application Error
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>
              Something went wrong while loading the application.
            </p>
            <div style={{
              backgroundColor: '#fef2f2',
              padding: '16px',
              borderRadius: '4px',
              border: '1px solid #fecaca',
              textAlign: 'left',
              marginBottom: '16px'
            }}>
              <div style={{ fontWeight: 'medium', color: '#dc2626', marginBottom: '8px' }}>
                Error Details:
              </div>
              <pre style={{
                fontSize: '14px',
                color: '#dc2626',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {this.state.error.toString()}
              </pre>
            </div>
            <button
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'medium'
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-gray-600">Loading...</span>
      </div>
    </div>
  );
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
const Sessions = lazy(() => import("./pages/Sessions"));

function AuthGate({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null | "loading">("loading");
  useEffect(() => onAuthStateChanged(auth, u => setUser(u ?? null)), []);
  if (user === "loading") return <PageLoader />;
  return user ? children : <Navigate to="/login" replace />;
}

function AdminOnly() {
  return <div className="p-6">Admin area (we'll guard by custom claim next)</div>;
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AuthGate><AppShell /></AuthGate>}>
            <Route index element={
              <Suspense fallback={<PageLoader />}>
                <Dashboard />
              </Suspense>
            } />
            <Route path="courses" element={
              <Suspense fallback={<PageLoader />}>
                <Courses />
              </Suspense>
            } />
            <Route path="courses/:courseId" element={
              <Suspense fallback={<PageLoader />}>
                <CourseDetail />
              </Suspense>
            } />
            <Route path="courses/:courseId/assignments/teacher" element={
              <Suspense fallback={<PageLoader />}>
                <AssignmentsTeacher />
              </Suspense>
            } />
            <Route path="courses/:courseId/assignments" element={
              <Suspense fallback={<PageLoader />}>
                <AssignmentsStudent />
              </Suspense>
            } />
            <Route path="assignments/:assignmentId/grade" element={
              <Suspense fallback={<PageLoader />}>
                <GradeSubmissions />
              </Suspense>
            } />
            <Route path="enrollments" element={
              <Suspense fallback={<PageLoader />}>
                <Enrollments />
              </Suspense>
            } />
            <Route path="manage-users" element={
              <Suspense fallback={<PageLoader />}>
                <ManageUsers />
              </Suspense>
            } />
            <Route path="attendance" element={
              <Suspense fallback={<PageLoader />}>
                <Attendance />
              </Suspense>
            } />
            <Route path="gradebook" element={
              <Suspense fallback={<PageLoader />}>
                <Gradebook />
              </Suspense>
            } />
            <Route path="announcements" element={
              <Suspense fallback={<PageLoader />}>
                <Announcements />
              </Suspense>
            } />
            <Route path="semesters" element={
              <Suspense fallback={<PageLoader />}>
                <Semesters />
              </Suspense>
            } />
            <Route path="settings" element={
              <Suspense fallback={<PageLoader />}>
                <Settings />
              </Suspense>
            } />
            <Route path="admin" element={<AdminOnly />} />
            <Route path="osce" element={
              <Suspense fallback={<PageLoader />}>
                <OSCE />
              </Suspense>
            } />
            <Route path="clinical" element={
              <Suspense fallback={<PageLoader />}>
                <ClinicalRotations />
              </Suspense>
            } />
            <Route path="immunizations" element={
              <Suspense fallback={<PageLoader />}>
                <Immunizations />
              </Suspense>
            } />
            <Route path="sessions" element={
              <Suspense fallback={<PageLoader />}>
                <Sessions />
              </Suspense>
            } />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

// Export the App component with error boundary
const AppWithErrorBoundary = () => (
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>
);

export default AppWithErrorBoundary;