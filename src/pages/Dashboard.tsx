import React, { useEffect, useState, useCallback, memo, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";
import { useRole } from "../hooks/useRole";
import { listCourses } from "../lib/courses";
import { listEnrollmentsForStudent, listEnrollments, type Enrollment } from "../lib/enrollments";
import { getUserStats, getUserByUid } from "../lib/users";
import { getAssignmentsDueForUser, getOverdueAssignmentsForUser, calculateOverallGradeForUser, calculateAttendanceForUser } from "../lib/assignments";
import {
  getCurrentSession,
  getNextSession,
  getAllSessions,
  getSessionDisplayName,
  type Session
} from "../lib/sessions";
import type { Course, Assignment, Role } from "../types";

// Import optimized components
import { DashboardStats } from "./components/DashboardStats";
import { CourseOverview } from "./components/CourseOverview";
import { AssignmentOverview } from "./components/AssignmentOverview";
import { SessionOverview } from "./components/SessionOverview";
import { QuickActions } from "./components/QuickActions";
import { StudentSnapshot } from "./components/StudentSnapshot";
import { StudentAcademicSummary } from "./components/StudentAcademicSummary";
import { StudentSchedule } from "./components/StudentSchedule";
import { StudentSupport } from "./components/StudentSupport";

function Dashboard() {
  const { user, role, mdYear, loading } = useRole();
  const navigate = useNavigate();

  // Core state - simplified
  const [courses, setCourses] = useState<Array<Course & { id: string }>>([]);
  const [enrollments, setEnrollments] = useState<Array<Enrollment & { id: string }>>([]);
  const [userStats, setUserStats] = useState<{
    totalUsers: number;
    students: number;
    teachers: number;
    admins: number;
    activeUsers: number;
  } | null>(null);
  const [assignmentsDue, setAssignmentsDue] = useState<Array<Assignment & { id: string }>>([]);
  const [overdueAssignments, setOverdueAssignments] = useState<Array<Assignment & { id: string }>>([]);
  const [overallGrade, setOverallGrade] = useState<number>(0);
  const [attendance, setAttendance] = useState<number>(0);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [nextSession, setNextSession] = useState<Session | null>(null);
  const currentSemesterLabel = useMemo(() => currentSession ? getSessionDisplayName(currentSession) : undefined, [currentSession]);

  // Loading states - consolidated
  const [isLoading, setIsLoading] = useState(true);

  // Handle potential null/undefined values gracefully
  const safeUser = user || null;
  const safeRole = role || 'student';
  const safeMdYear = mdYear || undefined;
  const isStudent = safeRole === 'student';
  const isTeacher = safeRole === 'teacher';
  const isAdmin = safeRole === 'admin';

  // Memoized computed values for performance
  const userDisplayName = useMemo(() =>
    safeUser?.displayName || safeUser?.email?.split('@')[0] || '',
    [safeUser?.displayName, safeUser?.email]
  );

  const memoizedUserStats = useMemo(() => {
    if (!userStats) return null;
    return {
      ...userStats,
      studentPercentage: userStats.totalUsers > 0 ? (userStats.students / userStats.totalUsers) * 100 : 0,
      teacherPercentage: userStats.totalUsers > 0 ? (userStats.teachers / userStats.totalUsers) * 100 : 0
    };
  }, [userStats]);

  const courseLookup = useMemo(() => {
    const map = new Map<string, Course & { id: string }>();
    courses.forEach((course) => {
      if (course.id) {
        map.set(course.id, course);
      }
    });
    return map;
  }, [courses]);

  const studentCourseIds = useMemo(() => {
    if (!isStudent) {
      return new Set<string>();
    }

    const ids = new Set<string>();
    enrollments.forEach((enrollment) => {
      if (enrollment.courseId) {
        ids.add(enrollment.courseId);
      }
    });
    return ids;
  }, [isStudent, enrollments]);

  const creditsInProgress = useMemo(() => {
    if (!isStudent) {
      return 0;
    }

    let total = 0;
    studentCourseIds.forEach((courseId) => {
      const course = courseLookup.get(courseId);
      if (course?.credits) {
        total += course.credits;
      }
    });
    return total;
  }, [isStudent, studentCourseIds, courseLookup]);

  const enrolledCoursesCount = useMemo(() => {
    return isStudent ? studentCourseIds.size : courses.length;
  }, [isStudent, studentCourseIds, courses]);

  const upcomingAssignments = useMemo(() => {
    if (!isStudent) {
      return [] as Array<Assignment & { id: string; courseTitle?: string }>;
    }

    return [...assignmentsDue]
      .sort((a, b) => (a.dueAt ?? 0) - (b.dueAt ?? 0))
      .slice(0, 4)
      .map((assignment) => ({
        ...assignment,
        id: assignment.id ?? `${assignment.courseId}-${assignment.dueAt}`,
        courseTitle: assignment.courseId ? courseLookup.get(assignment.courseId)?.title : undefined
      }));
  }, [isStudent, assignmentsDue, courseLookup]);

  const overdueAssignmentsForSummary = useMemo(() => {
    if (!isStudent) {
      return [] as Array<Assignment & { id: string; courseTitle?: string }>;
    }

    return overdueAssignments.map((assignment) => ({
      ...assignment,
      id: assignment.id ?? `${assignment.courseId}-${assignment.dueAt}`,
      courseTitle: assignment.courseId ? courseLookup.get(assignment.courseId)?.title : undefined
    }));
  }, [isStudent, overdueAssignments, courseLookup]);

  const courseEnrollmentCounts = useMemo(() => {
    if (enrollments.length === 0) {
      return {} as Record<string, number>;
    }

    return enrollments.reduce((acc, enrollment) => {
      if (enrollment.courseId) {
        acc[enrollment.courseId] = (acc[enrollment.courseId] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [enrollments]);

  // Memoized navigation handlers
  const handleNavigateToCourse = useCallback((courseId: string) => {
    navigate(`/courses/${courseId}`);
  }, [navigate]);

  const handleNavigate = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  // Optimized data fetching with error handling
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (loading || !safeUser) return;

      try {
        setIsLoading(true);

        // Parallel data fetching for better performance
        // Get sessions first, then find current and next
        const sessionsData = await Promise.allSettled([
          listCourses(),
          safeRole === 'admin' ? getUserStats() : Promise.resolve(null),
          getAllSessions()
        ]);

        const [
          coursesData,
          userStatsData,
          allSessionsData
        ] = sessionsData;

        // Handle courses data
        if (coursesData.status === 'fulfilled') {
          setCourses(coursesData.value);
        }

        // Handle user stats (admin only)
        if (userStatsData.status === 'fulfilled' && userStatsData.value) {
          setUserStats(userStatsData.value);
        }

        // Handle sessions data
        if (allSessionsData.status === 'fulfilled') {
          const fetchedSessions = allSessionsData.value ?? [];
          setCurrentSession(getCurrentSession(fetchedSessions));
          setNextSession(getNextSession(fetchedSessions));
        }

        // Fetch role-specific data
        let studentProfileId: string | undefined;

        if (isStudent && safeUser?.uid) {
          try {
            const profile = await getUserByUid(safeUser.uid);
            studentProfileId = profile?.id;
          } catch (profileError) {
          }
        }

        if (isStudent && safeUser?.email) {
          const [
            enrollmentsData,
            assignmentsData,
            overdueData,
            gradeData,
            attendanceData
          ] = await Promise.allSettled([
            // Use Firestore profile id when available to ensure IDs match across collections
            listEnrollmentsForStudent(studentProfileId ?? safeUser.uid ?? safeUser.email),
            getAssignmentsDueForUser(studentProfileId ?? safeUser.uid ?? safeUser.email),
            getOverdueAssignmentsForUser(studentProfileId ?? safeUser.uid ?? safeUser.email),
            calculateOverallGradeForUser(studentProfileId ?? safeUser.uid ?? safeUser.email),
            calculateAttendanceForUser(studentProfileId ?? safeUser.uid ?? safeUser.email)
          ]);

          if (enrollmentsData.status === 'fulfilled') {
            setEnrollments(enrollmentsData.value);
          }
          if (assignmentsData.status === 'fulfilled') {
            setAssignmentsDue(assignmentsData.value);
          }
          if (overdueData.status === 'fulfilled') {
            setOverdueAssignments(overdueData.value);
          }
          if (gradeData.status === 'fulfilled') {
            setOverallGrade(gradeData.value);
          }
          if (attendanceData.status === 'fulfilled') {
            setAttendance(attendanceData.value);
          }
        } else {
          const [enrollmentsData] = await Promise.allSettled([
            listEnrollments()
          ]);

          if (enrollmentsData.status === 'fulfilled') {
            setEnrollments(enrollmentsData.value as Array<Enrollment & { id: string }>);
          }

          if ((isTeacher || isAdmin) && safeUser?.uid) {
            const overdueData = await getOverdueAssignmentsForUser(safeUser.uid);
            setOverdueAssignments(overdueData);
          }
        }

      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [loading, safeUser, safeRole, isAdmin, isStudent, isTeacher]);

  // Show loading state
  if (loading || isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (isStudent) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Student Dashboard"
          userName={userDisplayName}
          role={safeRole}
          mdYear={safeMdYear}
        />

        <StudentSnapshot
          mdYear={safeMdYear}
          overallGrade={overallGrade}
          attendance={attendance}
          creditsInProgress={creditsInProgress}
          enrolledCourses={enrolledCoursesCount}
          currentSemester={currentSemesterLabel}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <StudentAcademicSummary
              upcomingAssignments={upcomingAssignments}
              overdueAssignments={overdueAssignmentsForSummary}
              onNavigate={handleNavigate}
            />
          </div>
          <StudentSchedule
            currentSession={currentSession}
            nextSession={nextSession}
            upcomingAssignments={upcomingAssignments}
            onNavigate={handleNavigate}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 2xl:grid-cols-4">
          <div className="space-y-6 lg:col-span-2 2xl:col-span-3">
            <CourseOverview
              courses={courses}
              enrollments={enrollments}
              courseEnrollments={courseEnrollmentCounts}
              coursesLoading={isLoading}
              role={safeRole}
              onNavigateToCourse={handleNavigateToCourse}
            />
            <QuickActions
              role={safeRole}
              onNavigate={handleNavigate}
            />
          </div>
          <StudentSupport onNavigate={handleNavigate} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        userName={userDisplayName}
        role={safeRole}
        mdYear={safeMdYear}
      />

      {isAdmin && (
        <DashboardStats
          userStats={memoizedUserStats}
          statsLoading={isLoading}
          role={safeRole}
        />
      )}

      <QuickActions
        role={safeRole}
        onNavigate={handleNavigate}
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CourseOverview
          courses={courses}
          enrollments={enrollments}
          courseEnrollments={courseEnrollmentCounts}
          coursesLoading={isLoading}
          role={safeRole}
          onNavigateToCourse={handleNavigateToCourse}
        />

        <AssignmentOverview
          assignmentsDue={assignmentsDue}
          overdueAssignments={overdueAssignments}
          overallGrade={overallGrade}
          attendance={attendance}
        />
      </div>

      <SessionOverview
        currentSession={currentSession}
        nextSession={nextSession}
        sessionsLoading={isLoading}
      />
    </div>
  );
}

// Memoize the entire Dashboard component
export default memo(Dashboard);
