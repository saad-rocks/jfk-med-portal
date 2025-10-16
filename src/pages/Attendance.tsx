import React, { useState, useEffect } from "react";
import { useRole } from "../hooks/useRole";
import { useToast } from "../hooks/useToast";
import { PageHeader } from "../components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Calendar as CalendarComponent } from "../components/ui/calendar";
import {
  getTeacherAssignments,
  debugTeacherAssignments,
  createSampleTeacherAssignments,
  type TeacherAssignment
} from "../lib/teacherAssignments";
import { listEnrollments, debugEnrollments, createSampleEnrollments, debugDatabaseState, diagnoseEnrollmentData } from "../lib/enrollments";
import {
  getAttendanceRecordsForCourseDate,
  getStudentCourseAttendanceRecords,
  calculateStudentCourseAttendancePercentage,
  createAttendanceRecord,
  getCourseDateAttendanceStats,
  getCourseAttendanceDates,
  getStudentCourseAttendanceCalendar,
  formatDateForStorage,
  quickMarkAttendanceBulk,
  getAttendanceSummary,
  diagnoseAttendanceData,
  fixAttendanceStudentIds,
  getAttendanceRecordsNeedingFix
} from "../lib/attendance";
import { getAllUsers, fixUserUids, type UserProfile } from "../lib/users";
import { listCourses } from "../lib/courses";
import type { AttendanceRecord, Course, Enrollment } from "../types";
import {
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
  FileText,
  BarChart3,
  Edit2,
  BookOpen,
  ChevronLeft,
  Search,
  Loader2,
  AlertCircle,
  CheckSquare,
  RefreshCw,
  Download,
  Zap,
  Eye
} from "lucide-react";

type ViewMode = 'course-selection' | 'calendar-view' | 'take-attendance' | 'view-records' | 'student-history';

export default function Attendance() {
  const { role, user } = useRole();
  const { push } = useToast();
  const [loading, setLoading] = useState(true);
  const [teacherCourses, setTeacherCourses] = useState<TeacherAssignment[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [currentView, setCurrentView] = useState<ViewMode>('course-selection');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [enrolledStudents, setEnrolledStudents] = useState<UserProfile[]>([]);
  const [studentEnrollments, setStudentEnrollments] = useState<Array<Enrollment & { id: string }>>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [attendanceStats, setAttendanceStats] = useState<{
    total: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
  }>({ total: 0, present: 0, absent: 0, late: 0, excused: 0 });
  const [calendarData, setCalendarData] = useState<{ [dateString: string]: boolean }>({});
  const [studentAttendanceMap, setStudentAttendanceMap] = useState<{ [studentId: string]: AttendanceRecord | null }>({});

  // Student-specific state
  const [studentAttendance, setStudentAttendance] = useState<AttendanceRecord[]>([]);
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [studentCalendarData, setStudentCalendarData] = useState<{ [dateString: string]: 'present' | 'absent' | 'late' | 'excused' }>({});
  const [courseAttendancePercentages, setCourseAttendancePercentages] = useState<{ [courseId: string]: number }>({});
  const [courseAttendanceRecords, setCourseAttendanceRecords] = useState<{ [courseId: string]: AttendanceRecord[] }>({});
  const [expandedCourses, setExpandedCourses] = useState<{ [courseId: string]: boolean }>({});

  // Loading states for better UX
  const [markingAttendance, setMarkingAttendance] = useState<{ [studentId: string]: boolean }>({});
  const [bulkOperationLoading, setBulkOperationLoading] = useState(false);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [courseDataLoading, setCourseDataLoading] = useState(false);
  const [attendanceViewLoading, setAttendanceViewLoading] = useState(false);

  // Cache for student enrollment mapping to improve performance
  const [enrollmentCache, setEnrollmentCache] = useState<{ [courseId: string]: { [studentId: string]: string } }>({});

  // Cache for course attendance session counts (for teacher view)
  const [courseSessionCounts, setCourseSessionCounts] = useState<{ [courseId: string]: number }>({});

  // Global enrollment cache for the page lifecycle
  const [allEnrollmentsCache, setAllEnrollmentsCache] = useState<Array<Enrollment & { id: string }> | null>(null);
  const [enrollmentsCacheTimestamp, setEnrollmentsCacheTimestamp] = useState<number>(0);

  // Student context
  const [studentAttendanceId, setStudentAttendanceId] = useState<string | null>(null);

  // Diagnostic state
  const [diagnosticData, setDiagnosticData] = useState<{
    attendance: any;
    enrollment: any;
    isRunning: boolean;
  }>({ attendance: null, enrollment: null, isRunning: false });

  // Fix state
  const [fixData, setFixData] = useState<{
    recordsToFix: any[];
    incorrectIds: string[];
    isRunning: boolean;
    results: any;
  }>({ recordsToFix: [], incorrectIds: [], isRunning: false, results: null });

  useEffect(() => {
    loadInitialData();
  }, [role, user]);

  // Helper function to get enrollments (with caching)
  const getEnrollmentsWithCache = async (forceRefresh: boolean = false): Promise<Array<Enrollment & { id: string }>> => {
    const cacheValidDuration = 5 * 60 * 1000; // 5 minutes cache
    const now = Date.now();

    // Return cache if valid and not forcing refresh
    if (!forceRefresh && allEnrollmentsCache && (now - enrollmentsCacheTimestamp) < cacheValidDuration) {
      return allEnrollmentsCache;
    }

    // Fetch fresh data
    const enrollments = await listEnrollments();
    setAllEnrollmentsCache(enrollments);
    setEnrollmentsCacheTimestamp(now);
    return enrollments;
  };

  // Helper to refresh enrollment cache
  const refreshEnrollmentCache = async () => {
    return getEnrollmentsWithCache(true);
  };

  const loadInitialData = async () => {
    try {
      setLoading(true);

      if (role === 'admin' || role === 'teacher') {
        // Load teacher courses and all courses
        const [coursesData, usersData] = await Promise.all([
          listCourses(),
          getAllUsers()
        ]);

        // For teachers, we need to find their Firestore document ID
        let teacherAssignments: any[] = [];
        if (role === 'teacher' && user) {
          const teacherUser = usersData.find(u =>
            u.email?.toLowerCase() === user.email?.toLowerCase() ||
            u.uid === user.uid
          );

          if (teacherUser?.id) {
            teacherAssignments = await getTeacherAssignments(teacherUser.id);
          }
        }

        setTeacherCourses(Array.isArray(teacherAssignments) ? teacherAssignments : []);
        setAllCourses(coursesData);
        setStudents(usersData.filter(u => u.role === 'student'));

        // Load session counts for all courses
        const sessionCounts: { [courseId: string]: number } = {};
        for (const course of coursesData) {
          if (course.id) {
            try {
              const dates = await getCourseAttendanceDates(course.id);
              sessionCounts[course.id] = Object.keys(dates).length;
            } catch (error) {
              sessionCounts[course.id] = 0;
            }
          }
        }
        setCourseSessionCounts(sessionCounts);
      } else if (role === 'student' && user) {

        const [coursesData, usersData, allEnrollments] = await Promise.all([
          listCourses(),
          getAllUsers(),
          listEnrollments()
        ]);

        setAllCourses(coursesData);
        setStudents(usersData.filter(u => u.role === 'student'));

        const currentUserProfile = usersData.find(u =>
          u.uid === user.uid || u.email?.toLowerCase() === user.email?.toLowerCase()
        ) ?? null;

        const candidateIds = new Set<string>();
        if (currentUserProfile?.id) candidateIds.add(currentUserProfile.id);
        if (currentUserProfile?.uid) candidateIds.add(currentUserProfile.uid);
        if (currentUserProfile?.studentId) candidateIds.add(currentUserProfile.studentId);
        if (user.uid) candidateIds.add(user.uid);
        if (user.email) candidateIds.add(user.email.toLowerCase());

        const enrollmentsForStudent = allEnrollments.filter(enrollment =>
          candidateIds.has(enrollment.studentId)
        );

        setStudentEnrollments(enrollmentsForStudent);

        const resolvedStudentId = enrollmentsForStudent[0]?.studentId ?? currentUserProfile?.id ?? currentUserProfile?.uid ?? user.uid ?? null;
        setStudentAttendanceId(resolvedStudentId);

        await updateStudentOverview(resolvedStudentId, enrollmentsForStudent);
        setCurrentView('course-selection');
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const updateStudentOverview = async (
    attendanceId: string | null,
    enrollments: Array<Enrollment & { id: string }>
  ) => {
    if (!attendanceId || enrollments.length === 0) {
      setAttendancePercentage(100);
      return;
    }

    try {
      let totalPresent = 0;
      let totalRecords = 0;
      const coursePercentages: { [courseId: string]: number } = {};
      const courseRecords: { [courseId: string]: AttendanceRecord[] } = {};

      await Promise.all(
        enrollments.map(async (enrollment) => {
          if (!enrollment.courseId) return;
          const records = await getStudentCourseAttendanceRecords(enrollment.studentId, enrollment.courseId);
          totalRecords += records.length;
          totalPresent += records.filter(record => record.status === 'present' || record.status === 'late').length;

          // Build per-course maps
          courseRecords[enrollment.courseId] = records;
          const presentCount = records.filter(r => r.status === 'present' || r.status === 'late').length;
          coursePercentages[enrollment.courseId] = records.length > 0 ? Math.round((presentCount / records.length) * 100) : 100;
        })
      );

      const percentage = totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : 100;
      setAttendancePercentage(percentage);
      setCourseAttendanceRecords(courseRecords);
      setCourseAttendancePercentages(coursePercentages);
    } catch (error) {
      setAttendancePercentage(100);
    }
  };

  const toggleExpandCourse = (courseId: string) => {
    setExpandedCourses(prev => ({ ...prev, [courseId]: !prev[courseId] }));
  };

  const handleSelectCourse = async (course: Course) => {
    setSelectedCourse(course);
    setCourseDataLoading(true);
    setCurrentView('calendar-view');

    try {
      const enrollments = await getEnrollmentsWithCache();
      const courseEnrollments = enrollments.filter(e => e.courseId === course.id && e.status === 'enrolled');

      const enrolledStudentIds = new Set(courseEnrollments.map(e => e.studentId));

      const matchedStudents = students.filter(student => {
        if (!student.id && !student.uid && !student.email) {
          return false;
        }
        return (
          (student.id && enrolledStudentIds.has(student.id)) ||
          (student.uid && enrolledStudentIds.has(student.uid)) ||
          (student.email && enrolledStudentIds.has(student.email))
        );
      });

      setEnrolledStudents(matchedStudents);

      const courseMapping: Record<string, string> = {};
      matchedStudents.forEach(student => {
        if (!student.id) return;
        const enrollment = courseEnrollments.find(e =>
          e.studentId === student.id ||
          e.studentId === student.uid ||
          e.studentId === student.email
        );
        if (enrollment) {
          courseMapping[student.id] = enrollment.studentId;
        }
      });

      setEnrollmentCache(prev => ({
        ...prev,
        [course.id!]: courseMapping
      }));

      // Load calendar data for the course
      const attendanceDates = await getCourseAttendanceDates(course.id!);
      setCalendarData(attendanceDates);

    } catch (error) {
    } finally {
      setCourseDataLoading(false);
    }
  };

  const handleDateSelect = async (date: Date) => {
    if (!selectedCourse) return;

    setSelectedDate(date);
    setAttendanceViewLoading(true);
    setCurrentView('take-attendance');

    const dateString = formatDateForStorage(date);

    try {
      // Load attendance records for this date
      const records = await getAttendanceRecordsForCourseDate(selectedCourse.id!, dateString);
      setAttendanceRecords(records);

      await buildStudentAttendanceMap();

      // Calculate stats for this date
      const stats = await getCourseDateAttendanceStats(selectedCourse.id!, dateString);
      setAttendanceStats(stats);

    } catch (error) {
    } finally {
      setAttendanceViewLoading(false);
    }
  };

  const handleMarkAttendance = async (studentId: string, status: AttendanceRecord['status']) => {
    if (!selectedCourse?.id || !studentId) return;

    // Set loading state for this student
    setMarkingAttendance(prev => ({ ...prev, [studentId]: true }));

    try {
    const dateString = formatDateForStorage(selectedDate);
      const student = enrolledStudents.find(s => s.id === studentId);

      // Use cached enrollment ID if available, otherwise find it
      let attendanceStudentId = enrollmentCache[selectedCourse.id]?.[studentId];

      if (!attendanceStudentId) {
        // Find enrollment and cache it
        const enrollments = await getEnrollmentsWithCache();
        const courseEnrollments = enrollments.filter(e => e.courseId === selectedCourse.id);

        const studentEnrollment = courseEnrollments.find(e =>
          e.studentId === studentId ||
          (student && e.studentId === student.uid) ||
          (student && e.studentId === student.email)
        );

        if (!studentEnrollment) {
          throw new Error(`No enrollment found for student ${student?.name || 'Unknown'}`);
        }

        attendanceStudentId = studentEnrollment.studentId;

        // Cache the enrollment mapping
        setEnrollmentCache(prev => ({
          ...prev,
          [selectedCourse.id]: {
            ...prev[selectedCourse.id],
            [studentId!]: attendanceStudentId
          }
        }));
      } else {
      }

      // Optimistically update UI
        const optimisticRecord = {
          id: `temp-${Date.now()}`,
          courseId: selectedCourse.id,
          studentId: studentId,
          date: dateString,
          status: status,
          timestamp: Date.now(),
          markedBy: 'optimistic'
        };

        setStudentAttendanceMap(prev => ({
          ...prev,
          [studentId]: optimisticRecord
        }));

      // Create/update attendance record
      await createAttendanceRecord(selectedCourse.id, attendanceStudentId, dateString, status);

      // Update calendar data immediately
      setCalendarData(prev => ({ ...prev, [dateString]: true }));

      // Update stats optimistically
      const currentRecord = attendanceRecords.find(r => r.studentId === attendanceStudentId);
      const newStats = { ...attendanceStats };

      if (currentRecord) {
        // Decrement old status count
        if (currentRecord.status === 'present') newStats.present--;
        else if (currentRecord.status === 'absent') newStats.absent--;
        else if (currentRecord.status === 'late') newStats.late--;
        else if (currentRecord.status === 'excused') newStats.excused--;
      } else {
        newStats.total++;
      }

      // Increment new status count
      if (status === 'present') newStats.present++;
      else if (status === 'absent') newStats.absent++;
      else if (status === 'late') newStats.late++;
      else if (status === 'excused') newStats.excused++;

      setAttendanceStats(newStats);

      // Show success feedback
      push({
        title: "Attendance Marked",
        description: `${student?.name || 'Student'} marked as ${status}`,
        variant: "success"
      });

    } catch (error) {

      // Revert optimistic update on error
      setStudentAttendanceMap(prev => ({
        ...prev,
        [studentId]: attendanceRecords.find(r => r.studentId === enrollmentCache[selectedCourse.id]?.[studentId]) || null
      }));

      push({
        title: "Error",
        description: `Failed to mark attendance: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "error"
      });
    } finally {
      setMarkingAttendance(prev => ({ ...prev, [studentId]: false }));
    }
  };

  // Enhanced bulk attendance marking with better performance
  const handleBulkMarkPresent = async () => {
    if (!selectedCourse?.id || enrolledStudents.length === 0) return;

    setBulkOperationLoading(true);
    const dateString = formatDateForStorage(selectedDate);

    try {
      const { auth } = await import('../firebase');
      if (!auth.currentUser) {
        throw new Error('User is not authenticated');
      }

      // Prepare bulk attendance updates using cached enrollment data
      const attendanceUpdates: Array<{ studentId: string; status: AttendanceRecord['status'] }> = [];

      for (const student of enrolledStudents) {
        if (!student.id) continue;

        // Use cached enrollment ID or find it
        let attendanceStudentId = enrollmentCache[selectedCourse.id]?.[student.id];

        if (!attendanceStudentId) {
          const enrollments = await getEnrollmentsWithCache();
          const courseEnrollments = enrollments.filter(e => e.courseId === selectedCourse.id);
        const studentEnrollment = courseEnrollments.find(e =>
          e.studentId === student.id ||
          e.studentId === student.uid ||
          e.studentId === student.email
        );

        if (studentEnrollment) {
            attendanceStudentId = studentEnrollment.studentId;
            // Cache for future use
            setEnrollmentCache(prev => ({
              ...prev,
              [selectedCourse.id]: {
                ...prev[selectedCourse.id],
                [student.id!]: attendanceStudentId
              }
            }));
          }
        }

        if (attendanceStudentId) {
          attendanceUpdates.push({ studentId: attendanceStudentId, status: 'present' });
        }
      }

      if (attendanceUpdates.length === 0) {
        throw new Error('No valid student enrollments found');
      }

      // Use optimized bulk operation
      const result = await quickMarkAttendanceBulk(selectedCourse.id, dateString, attendanceUpdates);

      if (result.failed > 0) {
        push({
          title: "Partial Success",
          description: `Marked ${result.success} students present, ${result.failed} failed`,
          variant: "default"
        });
      } else {
        push({
          title: "Bulk Attendance Marked",
          description: `Successfully marked ${result.success} students as present`,
          variant: "success"
        });
      }

      // Update calendar and stats
      setCalendarData(prev => ({ ...prev, [dateString]: true }));
      setAttendanceStats(prev => ({
        ...prev,
        total: enrolledStudents.length,
        present: result.success,
        absent: enrolledStudents.length - result.success,
        late: 0,
        excused: 0
      }));

      // Refresh attendance records
      const records = await getAttendanceRecordsForCourseDate(selectedCourse.id, dateString);
      setAttendanceRecords(records);
      await buildStudentAttendanceMap();

    } catch (error) {
      push({
        title: "Bulk Operation Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "error"
      });
    } finally {
      setBulkOperationLoading(false);
    }
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setCurrentView('course-selection');
    setAttendanceRecords([]);
    setAttendanceStats({ total: 0, present: 0, absent: 0, late: 0, excused: 0 });
    setCalendarData({});
  };

  const handleBackToCalendar = async () => {
    // Reload calendar data from database to ensure we have latest attendance records
    if (selectedCourse?.id) {
      try {
        const attendanceDates = await getCourseAttendanceDates(selectedCourse.id);
        setCalendarData(attendanceDates);
      } catch (error) {
      }
    }

    setCurrentView('calendar-view');
    setAttendanceRecords([]);
    setAttendanceStats({ total: 0, present: 0, absent: 0, late: 0, excused: 0 });
  };

  // Diagnostic function to identify attendance data issues
  const runAttendanceDiagnostics = async () => {
    if (!selectedCourse?.id) {
      push({
        title: "Error",
        description: "Please select a course first",
        variant: "error"
      });
      return;
    }

    setDiagnosticData(prev => ({ ...prev, isRunning: true }));

    try {

      const [attendanceData, enrollmentData] = await Promise.all([
        diagnoseAttendanceData(selectedCourse.id),
        diagnoseEnrollmentData(selectedCourse.id)
      ]);

      setDiagnosticData({
        attendance: attendanceData,
        enrollment: enrollmentData,
        isRunning: false
      });


      // Check for ID mismatches
      const attendanceIds = new Set(attendanceData.uniqueStudentIds);
      const enrollmentIds = new Set(enrollmentData.uniqueStudentIds);
      const missingInAttendance = enrollmentData.uniqueStudentIds.filter(id => !attendanceIds.has(id));
      const extraInAttendance = attendanceData.uniqueStudentIds.filter(id => !enrollmentIds.has(id));

      if (missingInAttendance.length > 0 || extraInAttendance.length > 0) {

        push({
          title: "ID Mismatch Detected",
          description: `${missingInAttendance.length} enrolled students missing attendance, ${extraInAttendance.length} extra records`,
          variant: "default"
        });
      } else {
        push({
          title: "Diagnostics Complete",
          description: "No ID mismatches found",
          variant: "success"
        });
      }

    } catch (error) {
      setDiagnosticData(prev => ({ ...prev, isRunning: false }));
      push({
        title: "Diagnostic Error",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "error"
      });
    }
  };

  // Function to analyze and fix attendance ID issues
  const analyzeAndFixAttendanceIssues = async () => {
    if (!selectedCourse?.id) {
      push({
        title: "Error",
        description: "Please select a course first",
        variant: "error"
      });
      return;
    }

    setFixData(prev => ({ ...prev, isRunning: true }));

    try {

      // Get all enrolled students
      const enrollments = await getEnrollmentsWithCache();
      const courseEnrollments = enrollments.filter(e => e.courseId === selectedCourse.id);
      const enrolledStudentIds = courseEnrollments.map(e => e.studentId);


      // Get all users to find their actual IDs
      const usersData = await getAllUsers();

      // Create mapping from enrollment IDs to actual user IDs
      const idMapping: { [oldId: string]: string } = {};

      for (const enrollment of courseEnrollments) {
        const enrollmentStudentId = enrollment.studentId;

        // Find the corresponding user
        const user = usersData.find(u =>
          u.uid === enrollmentStudentId ||
          u.email === enrollmentStudentId ||
          u.id === enrollmentStudentId ||
          u.studentId === enrollmentStudentId
        );

        if (user) {
          // The user should be using their uid, email, or profile id
          const correctIds = [user.uid, user.email, user.id].filter(id => id);

          // If the enrollment ID is not one of the correct IDs, map it
          if (!correctIds.includes(enrollmentStudentId)) {
            // Use the first available correct ID
            const correctId = correctIds[0];
            if (correctId) {
              idMapping[enrollmentStudentId] = correctId;
            }
          }
        }
      }


      if (Object.keys(idMapping).length === 0) {
        push({
          title: "No Issues Found",
          description: "All attendance records appear to use correct student IDs",
          variant: "success"
        });
        setFixData(prev => ({ ...prev, isRunning: false, recordsToFix: [], incorrectIds: [] }));
        return;
      }

      // Get records that need fixing
      const { recordsToFix, incorrectIds } = await getAttendanceRecordsNeedingFix(selectedCourse.id, enrolledStudentIds);
      setFixData(prev => ({
        ...prev,
        recordsToFix,
        incorrectIds,
        isRunning: false
      }));


      // Automatically apply the fix
      const results = await fixAttendanceStudentIds(selectedCourse.id, idMapping);

      setFixData(prev => ({ ...prev, results }));

      if (results.updated > 0) {
        push({
          title: "Fix Applied Successfully",
          description: `Updated ${results.updated} attendance records`,
          variant: "success"
        });

        // Re-run diagnostics to show the improvement
        await runAttendanceDiagnostics();
      } else if (results.failed > 0) {
        push({
          title: "Fix Failed",
          description: `Failed to update ${results.failed} records`,
          variant: "error"
        });
      }

    } catch (error) {
      setFixData(prev => ({ ...prev, isRunning: false }));
      push({
        title: "Fix Error",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "error"
      });
    }
  };

  // Build mapping from student IDs to their attendance records
  const buildStudentAttendanceMap = async () => {
    if (!selectedCourse?.id) return;

    const enrollments = await getEnrollmentsWithCache();
    const courseEnrollments = enrollments.filter(e => e.courseId === selectedCourse.id);

    const mapping: { [studentId: string]: AttendanceRecord | null } = {};


    for (const student of enrolledStudents) {
      if (!student.id) continue; // Skip students without IDs


      // Find the enrollment for this student to get the correct studentId used in attendance records
      const studentEnrollment = courseEnrollments.find(e =>
        e.studentId === student.id ||
        e.studentId === student.uid ||
        e.studentId === student.email
      );

      const correctStudentId = studentEnrollment?.studentId || student.id;

      const record = attendanceRecords.find(r => r.studentId === correctStudentId);

      mapping[student.id] = record || null;
    }

    setStudentAttendanceMap(mapping);
  };

  const handleViewStudentHistory = async (course: Course) => {
    if (!user) return;

    setSelectedCourse(course);
    setAttendanceViewLoading(true);
    setCurrentView('student-history');

    try {
      const enrollmentForCourse = studentEnrollments.find(enrollment => enrollment.courseId === course.id);
      const attendanceId = enrollmentForCourse?.studentId ?? studentAttendanceId ?? user.uid;

      const [records, percentage, calendarData] = await Promise.all([
        getStudentCourseAttendanceRecords(attendanceId, course.id!),
        calculateStudentCourseAttendancePercentage(attendanceId, course.id!),
        getStudentCourseAttendanceCalendar(attendanceId, course.id!)
      ]);

      setStudentAttendance(records);
      setAttendancePercentage(percentage);
      setStudentCalendarData(calendarData);
    } catch (error) {
    } finally {
      setAttendanceViewLoading(false);
    }
  };

  const handleFixUserUids = async () => {
    if (!confirm('This will attempt to fix missing uid fields for existing users. Continue?')) {
      return;
    }

    try {
      await fixUserUids();
      alert('User uid fields have been updated. Please refresh the page to see the changes.');
      // Reload student data
      const usersData = await getAllUsers();
      setStudents(usersData.filter(u => u.role === 'student'));
    } catch (error) {
      alert('Failed to fix user uids. Please check the console for details.');
    }
  };

  const getAttendanceStatusIcon = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'late':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'excused':
        return <ShieldCheck className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getAttendanceStatusBadge = (status: AttendanceRecord['status']) => {
    const variants = {
      present: 'success' as const,
      absent: 'error' as const,
      late: 'secondary' as const,
      excused: 'outline' as const
    };

    return (
      <Badge variant={variants[status]} className="capitalize">
        {getAttendanceStatusIcon(status)}
        <span className="ml-1">{status}</span>
      </Badge>
    );
  };

  const filteredCourses = (role === 'admin' || role === 'teacher')
    ? (role === 'teacher'
        ? teacherCourses
            .map(tc => allCourses.find(c => c.id === tc.courseId))
            .filter(Boolean)
            .filter(course => {
              if (!searchQuery.trim()) return true;
              const query = searchQuery.toLowerCase();
              return (course!.title || '').toLowerCase().includes(query) ||
                     (course!.code || '').toLowerCase().includes(query);
            })
        : allCourses.filter(course => {
            if (!searchQuery.trim()) return true;
            const query = searchQuery.toLowerCase();
            return (course.title || '').toLowerCase().includes(query) ||
                   (course.code || '').toLowerCase().includes(query);
          }))
    : allCourses
        .filter(course => {
          // First filter by student enrollments
          if (!course.id) return false;

          const isEnrolled = studentEnrollments.some(enrollment => enrollment.courseId === course.id);
          return isEnrolled;
        })
        .filter(course => {
          // Then filter by search query
          if (!searchQuery.trim()) return true;
          const query = searchQuery.toLowerCase();
          return (course.title || '').toLowerCase().includes(query) ||
                 (course.code || '').toLowerCase().includes(query);
        });

  // Skeleton Loader Component
  const SkeletonCard = () => (
    <Card className="animate-pulse">
      <div className="flex flex-col md:flex-row gap-6 p-6">
        <div className="flex items-start gap-4 md:flex-1">
          <div className="w-14 h-14 rounded-xl bg-gray-200" />
          <div className="flex-1 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
        <div className="flex items-center gap-6 md:flex-1">
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-lg w-32 h-20" />
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-lg w-32 h-20" />
        </div>
        <div className="flex flex-col gap-3 md:w-64">
          <div className="h-9 bg-gray-200 rounded" />
          <div className="h-9 bg-gray-200 rounded" />
        </div>
      </div>
    </Card>
  );

  const SkeletonStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-8 w-16 bg-gray-200 rounded" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
              <div className="h-8 w-8 bg-gray-200 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={role === 'student' ? "My Attendance" : "Attendance Management"}
          breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Attendance' }]}
        />

        {/* Quick Stats Skeleton */}
        <SkeletonStats />

        {/* Search Bar Skeleton */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md h-10 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Course Cards Skeleton */}
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  // Admin/Teacher View
  if (role === 'admin' || role === 'teacher') {
    if (currentView === 'calendar-view' && selectedCourse) {
      if (courseDataLoading) {
        return (
          <div className="space-y-6">
            <PageHeader
              title={`Attendance Calendar - ${selectedCourse.title}`}
              breadcrumb={[
                { label: 'Attendance', to: '/attendance' },
                { label: selectedCourse.title }
              ]}
              actions={
                <Button variant="outline" onClick={handleBackToCourses}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back to Courses
                </Button>
              }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Course Info Skeleton */}
              <Card className="animate-pulse">
                <CardHeader>
                  <div className="h-5 bg-gray-200 rounded w-1/2" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                </CardContent>
              </Card>

              {/* Calendar Skeleton */}
              <Card className="lg:col-span-2 animate-pulse">
                <CardHeader>
                  <div className="h-5 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="h-80 bg-gray-200 rounded" />
                </CardContent>
              </Card>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-6">
          <PageHeader
            title={`Attendance Calendar - ${selectedCourse.title}`}
            breadcrumb={[
              { label: 'Attendance', to: '/attendance' },
              { label: selectedCourse.title }
            ]}
            actions={
              <Button variant="outline" onClick={handleBackToCourses}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Courses
              </Button>
            }
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Course Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Course Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">Course Code</div>
                  <div className="font-medium">{selectedCourse.code}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Title</div>
                  <div className="font-medium">{selectedCourse.title}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Instructor</div>
                  <div className="font-medium">{selectedCourse.instructor}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Enrolled Students</div>
                  <div className="font-medium">{enrolledStudents.length}</div>
                </div>

                {/* Attendance Summary for Selected Date */}
                {attendanceStats.total > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      {selectedDate.toLocaleDateString()} Attendance:
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                        <span>Present: {attendanceStats.present}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                        <span>Absent: {attendanceStats.absent}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
                        <span>Late: {attendanceStats.late}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
                        <span>Excused: {attendanceStats.excused}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Calendar */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Select Date</CardTitle>
                <p className="text-sm text-gray-600">Click on a date to mark attendance for that day</p>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                  attendanceData={calendarData}
                  showAttendanceStats={true}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    if (currentView === 'take-attendance' && selectedCourse) {
      if (attendanceViewLoading) {
        return (
          <div className="space-y-6">
            <PageHeader
              title={`Mark Attendance - ${selectedCourse.title}`}
              breadcrumb={[
                { label: 'Attendance', to: '/attendance' },
                { label: selectedCourse.title },
                { label: selectedDate.toLocaleDateString() }
              ]}
              actions={
                <Button variant="outline" onClick={handleBackToCalendar}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back to Calendar
                </Button>
              }
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Quick Actions Skeleton */}
              <Card className="animate-pulse">
                <CardHeader>
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="h-9 bg-gray-200 rounded" />
                  <div className="h-9 bg-gray-200 rounded" />
                  <div className="h-9 bg-gray-200 rounded" />
                </CardContent>
              </Card>

              {/* Stats Skeleton */}
              <Card className="animate-pulse">
                <CardHeader>
                  <div className="h-5 bg-gray-200 rounded w-2/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-gray-200 rounded-lg" />
                    <div className="h-20 bg-gray-200 rounded-lg" />
                    <div className="h-20 bg-gray-200 rounded-lg" />
                    <div className="h-20 bg-gray-200 rounded-lg" />
                  </div>
                </CardContent>
              </Card>

              {/* Student List Skeleton */}
              <Card className="lg:col-span-2 animate-pulse">
                <CardHeader>
                  <div className="h-5 bg-gray-200 rounded w-1/3" />
                  <div className="h-10 bg-gray-200 rounded mt-3" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full" />
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-32" />
                            <div className="h-3 bg-gray-200 rounded w-48" />
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <div className="h-8 w-8 bg-gray-200 rounded" />
                          <div className="h-8 w-8 bg-gray-200 rounded" />
                          <div className="h-8 w-8 bg-gray-200 rounded" />
                          <div className="h-8 w-8 bg-gray-200 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-6">
          <PageHeader
            title={`Mark Attendance - ${selectedCourse.title}`}
            breadcrumb={[
              { label: 'Attendance', to: '/attendance' },
              { label: selectedCourse.title },
              { label: selectedDate.toLocaleDateString() }
            ]}
            actions={
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    setCalendarLoading(true);
                    try {
                      const dateString = formatDateForStorage(selectedDate);
                      const [records, stats] = await Promise.all([
                        getAttendanceRecordsForCourseDate(selectedCourse.id!, dateString),
                        getCourseDateAttendanceStats(selectedCourse.id!, dateString)
                      ]);

                      setAttendanceRecords(records);
                      setAttendanceStats(stats);
                      await buildStudentAttendanceMap();

                      push({
                        title: "Refreshed",
                        description: "Attendance data updated",
                        variant: "success"
                      });
                    } catch (error) {
                      push({
                        title: "Refresh Failed",
                        description: "Could not update attendance data",
                        variant: "error"
                      });
                    } finally {
                      setCalendarLoading(false);
                    }
                  }}
                  disabled={calendarLoading}
                  className="flex items-center gap-2"
                >
                  {calendarLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Refresh
                </Button>
                <Button
                  onClick={runAttendanceDiagnostics}
                  disabled={diagnosticData.isRunning}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {diagnosticData.isRunning ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  Diagnose
                </Button>
              <Button variant="outline" onClick={handleBackToCalendar}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Calendar
              </Button>
              </div>
            }
          />

          {/* Diagnostic Results */}
          {diagnosticData.attendance && diagnosticData.enrollment && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  Attendance Diagnostic Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Attendance Records</h4>
                    <div className="space-y-1 text-sm">
                      <div>Total Records: <span className="font-medium">{diagnosticData.attendance.totalRecords}</span></div>
                      <div>Unique Student IDs: <span className="font-medium">{diagnosticData.attendance.uniqueStudentIds.length}</span></div>
                      {diagnosticData.attendance.issues.length > 0 && (
                        <div className="text-red-600">Issues: {diagnosticData.attendance.issues.length}</div>
                      )}
                    </div>
                    {diagnosticData.attendance.sampleRecords.length > 0 && (
                      <div className="mt-3">
                        <div className="text-xs text-gray-600 mb-1">Sample Student IDs:</div>
                        <div className="text-xs font-mono bg-gray-100 p-2 rounded max-h-20 overflow-y-auto">
                          {diagnosticData.attendance.sampleRecords.slice(0, 5).map((record: any) => record.studentId).join(', ')}
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Enrollments</h4>
                    <div className="space-y-1 text-sm">
                      <div>Total Enrollments: <span className="font-medium">{diagnosticData.enrollment.totalEnrollments}</span></div>
                      <div>Unique Student IDs: <span className="font-medium">{diagnosticData.enrollment.uniqueStudentIds.length}</span></div>
                      {diagnosticData.enrollment.issues.length > 0 && (
                        <div className="text-red-600">Issues: {diagnosticData.enrollment.issues.length}</div>
                      )}
                    </div>
                    {diagnosticData.enrollment.sampleEnrollments.length > 0 && (
                      <div className="mt-3">
                        <div className="text-xs text-gray-600 mb-1">Sample Student IDs:</div>
                        <div className="text-xs font-mono bg-gray-100 p-2 rounded max-h-20 overflow-y-auto">
                          {diagnosticData.enrollment.sampleEnrollments.slice(0, 5).map((enrollment: any) => enrollment.studentId).join(', ')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    onClick={analyzeAndFixAttendanceIssues}
                    disabled={fixData.isRunning}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {fixData.isRunning ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    Auto-Fix ID Issues
                  </Button>
                  {fixData.results && (
                    <div className="text-sm text-green-600 flex items-center">
                      ✅ Fixed {fixData.results.updated} records
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleBulkMarkPresent}
                  className="w-full"
                  variant="outline"
                  disabled={bulkOperationLoading}
                  size="sm"
                >
                  {bulkOperationLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Mark All Present
                    </>
                  )}
                </Button>

                <Button
                  onClick={async () => {
                    if (!selectedCourse?.id) return;
                    const dateString = formatDateForStorage(selectedDate);
                    const summary = await getAttendanceSummary(selectedCourse.id, dateString);
                    push({
                      title: "Attendance Summary",
                      description: `${summary.present} present, ${summary.absent} absent, ${summary.late} late, ${summary.excused} excused`,
                      variant: "default"
                    });
                  }}
                  className="w-full"
                  variant="ghost"
                  size="sm"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Get Summary
                </Button>

                <Button
                  onClick={async () => {
                    // Export attendance data for the day
                    const dateString = formatDateForStorage(selectedDate);
                    const records = await getAttendanceRecordsForCourseDate(selectedCourse!.id!, dateString);
                    const csvContent = [
                      ['Student Name', 'Email', 'Status', 'Time'],
                      ...records.map(record => [
                        enrolledStudents.find(s => s.id === record.studentId)?.name || 'Unknown',
                        enrolledStudents.find(s => s.id === record.studentId)?.email || '',
                        record.status,
                        new Date(record.timestamp).toLocaleString()
                      ])
                    ].map(row => row.join(',')).join('\n');

                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `attendance-${selectedCourse!.title}-${dateString}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);

                    push({
                      title: "Export Complete",
                      description: "Attendance data exported successfully",
                      variant: "success"
                    });
                  }}
                  className="w-full"
                  variant="ghost"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </CardContent>
            </Card>

            {/* Attendance Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  Daily Statistics
                </CardTitle>
                <p className="text-sm text-gray-600">{selectedDate.toLocaleDateString()}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{attendanceStats.total}</div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{attendanceStats.present}</div>
                    <div className="text-sm text-gray-600">Present</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{attendanceStats.absent}</div>
                    <div className="text-sm text-gray-600">Absent</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{attendanceStats.late}</div>
                    <div className="text-sm text-gray-600">Late</div>
                  </div>
                </div>

                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{attendanceStats.excused}</div>
                  <div className="text-sm text-gray-600">Excused</div>
                </div>


              </CardContent>
            </Card>

            {/* Student List */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Mark Attendance</CardTitle>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {enrolledStudents
                    .filter(student =>
                      !searchQuery.trim() ||
                      `${student.name} ${student.email}`.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((student) => {
                      const record = student.id ? studentAttendanceMap[student.id] : null;

                      return (
                        <div key={student.id} className={`flex items-center justify-between p-3 border rounded-lg transition-all duration-200 ${
                          markingAttendance[student.id!] ? 'bg-blue-50 border-blue-200' :
                          record ? 'hover:bg-gray-50' : 'hover:bg-gray-50'
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {student.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-gray-600">{student.email}</div>
                              {markingAttendance[student.id!] && (
                                <div className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  Processing...
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {record ? (
                              <div className="flex items-center gap-2">
                                {getAttendanceStatusBadge(record.status)}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleMarkAttendance(student.id!, 'present')}
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleMarkAttendance(student.id!, 'present')}
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                                  disabled={markingAttendance[student.id!]}
                                  title="Mark Present"
                                >
                                  {markingAttendance[student.id!] ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                  <CheckCircle className="h-3 w-3" />
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleMarkAttendance(student.id!, 'absent')}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                  disabled={markingAttendance[student.id!]}
                                  title="Mark Absent"
                                >
                                  {markingAttendance[student.id!] ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                  <XCircle className="h-3 w-3" />
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleMarkAttendance(student.id!, 'late')}
                                  className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 border-yellow-200"
                                  disabled={markingAttendance[student.id!]}
                                  title="Mark Late"
                                >
                                  {markingAttendance[student.id!] ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                  <Clock className="h-3 w-3" />
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleMarkAttendance(student.id!, 'excused')}
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                                  disabled={markingAttendance[student.id!]}
                                  title="Mark Excused"
                                >
                                  {markingAttendance[student.id!] ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <ShieldCheck className="h-3 w-3" />
                                  )}
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    // Course Selection View (Default)
    return (
      <div className="space-y-6">
        <PageHeader
          title="Attendance Management"
          breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Attendance' }]}
        />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{filteredCourses.length}</div>
                  <div className="text-sm text-gray-600">{role === 'teacher' ? 'My Courses' : 'Total Courses'}</div>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{students.length}</div>
                  <div className="text-sm text-gray-600">Total Students</div>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {filteredCourses.filter(c => c?.semester === 'MD-1').length}
                  </div>
                  <div className="text-sm text-gray-600">Active Semester</div>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Courses Cards */}
        <div className="space-y-4">
          {filteredCourses.map((course) => {
            if (!course) return null;
            const totalClasses = courseSessionCounts[course.id!] ?? 0;

            return (
              <Card
                key={course.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex flex-col md:flex-row gap-6 p-6">
                  {/* Left Section - Course Info */}
                  <div className="flex items-start gap-4 md:flex-1">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 bg-gradient-to-br from-blue-100 to-indigo-100 group-hover:from-blue-200 group-hover:to-indigo-200">
                      <BookOpen className="h-7 w-7 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors truncate">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{course.code} • {course.semester}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Users className="h-4 w-4 inline" />
                        {course.instructor}
                      </p>
                    </div>
                  </div>

                  {/* Middle Section - Stats */}
                  <div className="flex items-center gap-6 md:flex-1">
                    <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="text-xs text-gray-600">Enrolled</div>
                        <div className="text-xl font-bold text-gray-900">
                          {enrolledStudents.length > 0 ? enrolledStudents.length : '-'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 bg-green-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="text-xs text-gray-600">Total Classes</div>
                        <div className="text-xl font-bold text-gray-900">{totalClasses}</div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Actions */}
                  <div className="flex flex-col gap-3 md:w-64">
                    <Button
                      size="sm"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleSelectCourse(course)}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Mark Attendance
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleSelectCourse(course)}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Reports
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600">
                {role === 'teacher'
                  ? searchQuery ? 'No courses match your search.' : "You haven't been assigned to teach any courses yet."
                  : searchQuery ? 'No courses match your search.' : "No courses are available in the system."
                }
              </p>
            </CardContent>
          </Card>
        )}

        {/* Admin Debug Tools */}
        {role === 'admin' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Admin Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {role === 'admin' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleFixUserUids}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      Fix User UIDs
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          const assignments = await debugTeacherAssignments();
                          alert(`Found ${assignments.length} teacher assignments in database. Check console for details.`);
                        } catch (error) {
                          alert('Error fetching teacher assignments');
                        }
                      }}
                      className="text-green-600 border-green-200 hover:bg-green-50"
                    >
                      Debug Assignments
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        if (!confirm('This will create sample teacher assignments for testing. Continue?')) {
                          return;
                        }
                        try {
                          await createSampleTeacherAssignments();
                          alert('Sample teacher assignments created! Please refresh the page.');
                          // Reload data
                          window.location.reload();
                        } catch (error) {
                          alert('Error creating sample assignments');
                        }
                      }}
                      className="text-purple-600 border-purple-200 hover:bg-purple-50"
                    >
                      Create Sample Assignments
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          await debugDatabaseState();
                          alert('Database state checked. Check console for complete details.');
                        } catch (error) {
                          alert('Error checking database state');
                        }
                      }}
                      className="text-purple-600 border-purple-200 hover:bg-purple-50"
                    >
                      Debug Database
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          const enrollments = await debugEnrollments();
                          alert(`Found ${enrollments.length} enrollments in database. Check console for details.`);
                        } catch (error) {
                          alert('Error fetching enrollments');
                        }
                      }}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      Debug Enrollments
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        if (!confirm('This will create sample enrollments for testing. Continue?')) {
                          return;
                        }
                        try {
                          await createSampleEnrollments();
                          alert('Sample enrollments created! Please refresh the page.');
                          window.location.reload();
                        } catch (error) {
                          alert('Error creating sample enrollments');
                        }
                      }}
                      className="text-orange-600 border-orange-200 hover:bg-orange-50"
                    >
                      Create Sample Enrollments
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Student View
  if (role === 'student' && user) {
    if (currentView === 'student-history' && selectedCourse) {
      // Attendance Details View - Shows list of attendance records
      const records = courseAttendanceRecords[selectedCourse.id!] ?? [];
      const percentage = courseAttendancePercentages[selectedCourse.id!] ?? 0;

      if (attendanceViewLoading) {
        return (
          <div className="space-y-6">
            <PageHeader
              title={`${selectedCourse.title} - Attendance Details`}
              breadcrumb={[
                { label: 'Attendance', to: '/attendance' },
                { label: selectedCourse.title }
              ]}
              actions={
                <Button variant="outline" onClick={handleBackToCourses}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back to Courses
                </Button>
              }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Course Info Skeleton */}
              <Card className="animate-pulse">
                <CardHeader>
                  <div className="h-5 bg-gray-200 rounded w-1/2" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                  <div className="pt-3 border-t">
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                    <div className="h-12 bg-gray-200 rounded w-1/3" />
                    <div className="h-2 bg-gray-200 rounded w-full mt-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Attendance Records Skeleton */}
              <Card className="lg:col-span-2 animate-pulse">
                <CardHeader>
                  <div className="h-5 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-center">
                            <div className="h-8 w-8 bg-gray-200 rounded" />
                            <div className="h-3 w-8 bg-gray-200 rounded mt-1" />
                          </div>
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-48" />
                            <div className="h-3 bg-gray-200 rounded w-32" />
                          </div>
                        </div>
                        <div className="h-6 w-20 bg-gray-200 rounded-full" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-6">
          <PageHeader
            title={`${selectedCourse.title} - Attendance Details`}
            breadcrumb={[
              { label: 'Attendance', to: '/attendance' },
              { label: selectedCourse.title }
            ]}
            actions={
              <Button variant="outline" onClick={handleBackToCourses}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Courses
              </Button>
            }
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Course Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Course Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">Course Code</div>
                  <div className="font-medium">{selectedCourse.code}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Instructor</div>
                  <div className="font-medium">{selectedCourse.instructor}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Semester</div>
                  <div className="font-medium">{selectedCourse.semester}</div>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">Attendance Rate</div>
                  <div className={`text-3xl font-bold ${percentage < 70 ? 'text-red-600' : 'text-blue-600'}`}>
                    {percentage}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        percentage < 70 ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-200">
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {records.filter(r => r.status === 'present' || r.status === 'late').length}
                    </div>
                    <div className="text-xs text-gray-600">Present</div>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded-lg">
                    <div className="text-lg font-bold text-red-600">
                      {records.filter(r => r.status === 'absent').length}
                    </div>
                    <div className="text-xs text-gray-600">Absent</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attendance Records List */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Attendance Records
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Showing {records.length} attendance {records.length === 1 ? 'record' : 'records'}
                </p>
              </CardHeader>
              <CardContent>
                {records.length > 0 ? (
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {records
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((record, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition bg-white"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center">
                              <div className="text-2xl font-bold text-gray-900">
                                {new Date(record.date).getDate()}
                              </div>
                              <div className="text-xs text-gray-600 uppercase">
                                {new Date(record.date).toLocaleDateString('en-US', { month: 'short' })}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {new Date(record.date).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </div>
                              <div className="text-sm text-gray-600">
                                Marked at {new Date(record.timestamp).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                          </div>
                          <div>
                            <Badge
                              variant={
                                record.status === 'present' ? 'success' :
                                record.status === 'absent' ? 'error' :
                                record.status === 'late' ? 'secondary' : 'outline'
                              }
                              className="capitalize text-sm px-3 py-1"
                            >
                              {record.status === 'present' && <CheckCircle className="h-3 w-3 mr-1 inline" />}
                              {record.status === 'absent' && <XCircle className="h-3 w-3 mr-1 inline" />}
                              {record.status === 'late' && <Clock className="h-3 w-3 mr-1 inline" />}
                              {record.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No attendance records</h3>
                    <p className="text-gray-600">No attendance has been marked for this course yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    // Student Course Selection (Default) - Redesigned with Course Cards
    return (
      <div className="space-y-6">
        <PageHeader
          title="My Attendance"
          breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Attendance' }]}
        />

        {/* Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Course Cards */}
        <div className="space-y-4">
          {filteredCourses.map((course) => {
            if (!course) return null;
            const percentage = courseAttendancePercentages[course.id!] ?? 0;
            const records = courseAttendanceRecords[course.id!] ?? [];
            const totalClasses = records.length;
            const presentClasses = records.filter(r => r.status === 'present' || r.status === 'late').length;

            return (
              <Card
                key={course.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 group"
                onClick={() => handleViewStudentHistory(course)}
              >
                <div className="flex flex-col md:flex-row gap-6 p-6">
                  {/* Left Section - Course Info */}
                  <div className="flex items-start gap-4 md:flex-1">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      percentage < 70
                        ? 'bg-red-100 group-hover:bg-red-200'
                        : 'bg-gradient-to-br from-blue-100 to-indigo-100 group-hover:from-blue-200 group-hover:to-indigo-200'
                    }`}>
                      <BookOpen className={`h-7 w-7 ${percentage < 70 ? 'text-red-600' : 'text-blue-600'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors truncate">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{course.code} • {course.semester}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Users className="h-4 w-4 inline" />
                        {course.instructor}
                      </p>
                    </div>
                  </div>

                  {/* Middle Section - Attendance Progress */}
                  <div className="md:flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Attendance Rate</span>
                      <span className={`text-3xl font-bold ${
                        percentage < 70 ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {percentage}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          percentage < 70
                            ? 'bg-red-500'
                            : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <div>
                          <div className="text-xs text-gray-600">Present</div>
                          <div className="text-sm font-bold text-gray-900">{presentClasses}/{totalClasses}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="text-xs text-gray-600">Total Classes</div>
                          <div className="text-sm font-bold text-gray-900">{totalClasses}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Actions & Warnings */}
                  <div className="flex flex-col justify-between gap-3 md:w-48">
                    {/* Warning for low attendance */}
                    {percentage < 70 && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-red-700">
                          <span className="font-medium block">Low Attendance</span>
                          Below 70% threshold
                        </div>
                      </div>
                    )}

                    {percentage >= 70 && (
                      <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-green-700">
                          <span className="font-medium block">Good Standing</span>
                          Meeting attendance requirements
                        </div>
                      </div>
                    )}

                    {/* View Details Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full group-hover:bg-blue-50 group-hover:border-blue-300 transition-colors mt-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewStudentHistory(course);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600">
                {searchQuery ? 'No courses match your search.' : 'You are not enrolled in any courses yet.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }


  // Fallback for unauthorized users
  return (
    <div className="space-y-4">
      <PageHeader title="Attendance" breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Attendance' }]} />
      <Card className="p-8 text-center">
        <ShieldCheck className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">You don&apos;t have permission to access the attendance system.</p>
      </Card>
    </div>
  );
}
