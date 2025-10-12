// Clean App.tsx file - recreating from scratch
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useRole } from "./hooks/useRole";
import { useSystemSettings } from "./hooks/useSystemSettings";
import { MaintenanceMode } from "./components/MaintenanceMode";
import AppShell from "./layouts/AppShell";
// Removed global seeding import to reduce bundle size

// Load test functions in development
if (import.meta.env.DEV) {
  import('./lib/testSystemFunctions').then(() => {
    console.log('✅ Test functions loaded. Use: window.testSystemFunctions.runAllTests()');
  });
}

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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
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

// Optimized loading fallback component
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

// Lazy wrapper to reduce Suspense boundaries
function LazyWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<PageLoader />}>
      {children}
    </Suspense>
  );
}

// Optimized lazy loading with code splitting
const Login = lazy(() => import("./pages/Login"));
const ProfileSetup = lazy(() => import("./pages/ProfileSetup"));

// Core pages loaded together (common usage)
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Courses = lazy(() => import("./pages/Courses"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const CourseCreate = lazy(() => import("./pages/CourseCreate"));
const CourseEdit = lazy(() => import("./pages/CourseEdit"));
const CourseEnrollments = lazy(() => import("./pages/CourseEnrollments"));
const CourseStudents = lazy(() => import("./pages/CourseStudents"));
const CoursesTeach = lazy(() => import("./pages/CoursesTeach"));
const CourseAssignInstructor = lazy(() => import("./pages/CourseAssignInstructor"));
const TimeTracking = lazy(() => import("./pages/TimeTracking"));
const AdminTimeEdit = lazy(() => import("./pages/AdminTimeEdit"));
const AdminTimeManualNew = lazy(() => import("./pages/AdminTimeManualNew"));
const Enrollments = lazy(() => import("./pages/Enrollments"));

// Management pages (less frequently used)
const ManageUsers = lazy(() => import("./pages/ManageUsers"));
const Assignments = lazy(() => import("./pages/Assignments"));
const AssignmentCreate = lazy(() => import("./pages/AssignmentCreate"));
const AssignmentEdit = lazy(() => import("./pages/AssignmentEdit"));
const AssignmentSubmit = lazy(() => import("./pages/AssignmentSubmit"));
const AssignmentsTeacher = lazy(() => import("./pages/AssignmentsTeacher"));
const AssignmentsStudent = lazy(() => import("./pages/AssignmentsStudent"));
const GradeSubmissions = lazy(() => import("./pages/GradeSubmissions"));
const Attendance = lazy(() => import("./pages/Attendance"));
const Gradebook = lazy(() => import("./pages/Gradebook"));
const GradesStudent = lazy(() => import("./pages/GradesStudent"));

// Less critical pages
const Announcements = lazy(() => import("./pages/Announcements"));
const Semesters = lazy(() => import("./pages/Semesters"));
const Settings = lazy(() => import("./pages/Settings"));

// Clinical pages (specialized)
const ClinicalRotations = lazy(() => import("./pages/ClinicalRotations"));
const ClinicalAssessments = lazy(() => import("./pages/ClinicalAssessments"));
const Immunizations = lazy(() => import("./pages/Immunizations"));
const Sessions = lazy(() => import("./pages/Sessions"));

// Admin pages (rarely used)
const DatabaseAdmin = lazy(() => import("./pages/DatabaseAdmin"));

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, role, loading } = useRole();
  const { settings, loading: settingsLoading } = useSystemSettings();

  if (loading || settingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600 font-medium">Authenticating...</span>
        </div>
      </div>
    );
  }

  // Check if system is in maintenance mode and user is not admin
  if (settings?.maintenanceMode && role !== "admin") {
    return <MaintenanceMode message={settings.maintenanceMessage} />;
  }

  // If user is authenticated but no profile exists, redirect to profile setup
  if (user && !role) {
    return <Navigate to="/profile-setup" replace />;
  }

  // If user is authenticated and has a role, show protected content
  if (user && role) {
    return <>{children}</>;
  }

  // If not authenticated, redirect to login
  return <Navigate to="/login" replace />;
}

function AdminOnly() {
  return <div className="p-6">Admin area (we&apos;ll guard by custom claim next)</div>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes without AuthGate */}
        <Route path="/login" element={
          <LazyWrapper>
            <Login />
          </LazyWrapper>
        } />
        <Route path="/profile-setup" element={
          <LazyWrapper>
            <ProfileSetup />
          </LazyWrapper>
        } />

        {/* Protected routes with AuthGate */}
        <Route path="/" element={<AuthGate><AppShell /></AuthGate>}>
          <Route index element={<Dashboard />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:courseId" element={<CourseDetail />} />
          <Route path="courses/new" element={<CourseCreate />} />
          <Route path="courses/:courseId/edit" element={<CourseEdit />} />
          <Route path="courses/:courseId/enrollments" element={<CourseEnrollments />} />
          <Route path="courses/teach" element={<CoursesTeach />} />
          <Route path="courses/:courseId/assign-instructor" element={<CourseAssignInstructor />} />
          <Route path="time" element={<TimeTracking />} />
          <Route path="admin/time/:entryId/edit" element={<AdminTimeEdit />} />
          <Route path="admin/time/manual/new" element={<AdminTimeManualNew />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="time" element={<TimeTracking />} />
          <Route path="admin/time/:entryId/edit" element={<AdminTimeEdit />} />
          <Route path="admin/time/manual/new" element={<AdminTimeManualNew />} />
          <Route path="assignments/new" element={<AssignmentCreate />} />
          <Route path="assignments/:assignmentId/edit" element={<AssignmentEdit />} />
          <Route path="assignments/:assignmentId/submit" element={<AssignmentSubmit />} />
          <Route path="courses/:courseId/assignments/teacher" element={<AssignmentsTeacher />} />
          <Route path="courses/:courseId/assignments" element={<AssignmentsStudent />} />
          <Route path="assignments/:assignmentId/grade" element={<GradeSubmissions />} />
          <Route path="enrollments" element={<Enrollments />} />
          <Route path="grades" element={<GradesStudent />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="courses/:courseId/gradebook" element={<Gradebook />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="semesters" element={<Semesters />} />
          <Route path="settings" element={<Settings />} />
          <Route path="admin" element={<AdminOnly />} />
          <Route path="database-admin" element={<DatabaseAdmin />} />
          <Route path="clinical" element={<ClinicalRotations />} />
          <Route path="courses/:courseId/clinical-assessments" element={<ClinicalAssessments />} />
          <Route path="immunizations" element={<Immunizations />} />
          <Route path="sessions" element={<Sessions />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
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







