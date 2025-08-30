import React, { useState, useEffect } from "react";
import { useRole } from "../hooks/useRole";
import { PageHeader } from "../components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Calendar as CalendarComponent, CompactCalendar } from "../components/ui/calendar";
import {
  getTeacherAssignments,
  debugTeacherAssignments,
  createSampleTeacherAssignments,
  type TeacherAssignment
} from "../lib/teacherAssignments";
import { listEnrollments, debugEnrollments, createSampleEnrollments, debugDatabaseState } from "../lib/enrollments";
import {
  getAttendanceRecordsForCourseDate,
  getStudentCourseAttendanceRecords,
  getStudentCourseAttendanceHistory,
  calculateStudentCourseAttendancePercentage,
  createAttendanceRecord,
  bulkCreateAttendanceRecords,
  getCourseDateAttendanceStats,
  getCourseAttendanceStats,
  getCourseAttendanceCalendar,
  getCourseAttendanceDates,
  getStudentCourseAttendanceCalendar,
  formatDateForStorage
} from "../lib/attendance";
import { getAllUsers, fixUserUids, type UserProfile } from "../lib/users";
import { listCourses } from "../lib/courses";
import type { AttendanceRecord, Course } from "../types";
import {
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
  UserCheck,
  FileText,
  BarChart3,
  Edit2,
  Eye,
  BookOpen,
  ChevronLeft,
  Plus,
  Search
} from "lucide-react";

type ViewMode = 'course-selection' | 'calendar-view' | 'take-attendance' | 'view-records' | 'student-history';

export default function Attendance() {
  const { role, user } = useRole();
  const [loading, setLoading] = useState(true);
  const [teacherCourses, setTeacherCourses] = useState<TeacherAssignment[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [currentView, setCurrentView] = useState<ViewMode>('course-selection');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [enrolledStudents, setEnrolledStudents] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [attendanceStats, setAttendanceStats] = useState<{
    total: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
  }>({ total: 0, present: 0, absent: 0, late: 0, excused: 0 });
  const [calendarData, setCalendarData] = useState<{ [dateString: string]: boolean }>({});

  // Student-specific state
  const [studentAttendance, setStudentAttendance] = useState<AttendanceRecord[]>([]);
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [studentCalendarData, setStudentCalendarData] = useState<{ [dateString: string]: boolean }>({});

  useEffect(() => {
    loadInitialData();
  }, [role, user]);

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
          // Find the teacher user document by email or UID
          const teacherUser = usersData.find(u =>
            u.email?.toLowerCase() === user.email?.toLowerCase() ||
            u.uid === user.uid
          );

          if (teacherUser?.id) {
            console.log('Found teacher document ID:', teacherUser.id);
            teacherAssignments = await getTeacherAssignments(teacherUser.id);
            console.log('Teacher assignments found:', teacherAssignments.length);
          } else {
            console.log('Teacher user document not found for email:', user.email);
          }
        }

        console.log('Teacher assignments loaded:', teacherAssignments);
        console.log('All courses loaded:', coursesData.length);
        console.log('All users loaded:', usersData.length);

        setTeacherCourses(Array.isArray(teacherAssignments) ? teacherAssignments : []);
        setAllCourses(coursesData);
        setStudents(usersData.filter(u => u.role === 'student'));
      } else if (role === 'student' && user) {
        // Load student courses and attendance data
        const [coursesData, usersData] = await Promise.all([
          listCourses(),
          getAllUsers()
        ]);

        setAllCourses(coursesData);
        setStudents(usersData.filter(u => u.role === 'student'));
        await loadStudentData();
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStudentData = async () => {
    if (!user) return;

    try {
      // For students, we need to show courses they're enrolled in
      // For now, show all courses (we'll filter by enrollment later)
      setCurrentView('course-selection');
    } catch (error) {
      console.error('Error loading student data:', error);
    }
  };

  const handleSelectCourse = async (course: Course) => {
    setSelectedCourse(course);
    setCurrentView('calendar-view');

    try {
      // Load enrolled students for this course
      const enrollments = await listEnrollments();
      console.log('All enrollments:', enrollments);
      console.log('Selected course ID:', course.id);

      const courseEnrollments = enrollments.filter(e => e.courseId === course.id);
      console.log('Course enrollments:', courseEnrollments);

      const enrolledStudentIds = courseEnrollments.map(e => e.studentId);
      console.log('Enrolled student IDs:', enrolledStudentIds);

      console.log('All students:', students.map(s => ({ id: s.id, uid: s.uid, name: s.name })));
      console.log('First few students details:', students.slice(0, 3).map(s => ({ id: s.id, uid: s.uid, name: s.name, email: s.email })));

      // Try matching by Firestore document ID first (most reliable)
      const enrolledStudentsById = students.filter(s => s.id && enrolledStudentIds.includes(s.id));
      console.log('Enrolled students by ID:', enrolledStudentsById.length, enrolledStudentsById.map(s => ({ id: s.id, name: s.name })));

      // Also try by uid if available
      const enrolledStudentsByUid = students.filter(s => s.uid && enrolledStudentIds.includes(s.uid));
      console.log('Enrolled students by UID:', enrolledStudentsByUid.length, enrolledStudentsByUid.map(s => ({ uid: s.uid, name: s.name })));

      // Combine results (prefer ID matches)
      const enrolledStudents = [...enrolledStudentsById];
      enrolledStudentsByUid.forEach(student => {
        if (!enrolledStudents.find(s => s.id === student.id)) {
          enrolledStudents.push(student);
        }
      });

      console.log('Final enrolled students found:', enrolledStudents.length, enrolledStudents.map(s => ({ id: s.id, uid: s.uid, name: s.name })));

      setEnrolledStudents(enrolledStudents);

      // Load calendar data for the course
      const attendanceDates = await getCourseAttendanceDates(course.id!);
      setCalendarData(attendanceDates);

    } catch (error) {
      console.error('Error loading course data:', error);
    }
  };

  const handleDateSelect = async (date: Date) => {
    if (!selectedCourse) return;

    setSelectedDate(date);
    setCurrentView('take-attendance');

    const dateString = formatDateForStorage(date);

    try {
      // Load attendance records for this date
      const records = await getAttendanceRecordsForCourseDate(selectedCourse.id!, dateString);
      setAttendanceRecords(records);

      // Calculate stats for this date
      const stats = await getCourseDateAttendanceStats(selectedCourse.id!, dateString);
      setAttendanceStats(stats);

    } catch (error) {
      console.error('Error loading attendance data for date:', error);
    }
  };

  const handleMarkAttendance = async (studentId: string, status: AttendanceRecord['status']) => {
    if (!selectedCourse?.id) return;

    // Validate studentId
    if (!studentId) {
      console.error('Student ID is undefined');
      alert('Student ID is missing. Please refresh the page and try again.');
      return;
    }

    console.log('Student ID being used:', studentId);
    console.log('Selected course ID:', selectedCourse.id);

    const dateString = formatDateForStorage(selectedDate);

    try {
      console.log('Marking attendance:', { courseId: selectedCourse.id, studentId, date: dateString, status });
      await createAttendanceRecord(selectedCourse.id, studentId, dateString, status);

      // Reload attendance records and stats
      const records = await getAttendanceRecordsForCourseDate(selectedCourse.id, dateString);
      setAttendanceRecords(records);

      const stats = await getCourseDateAttendanceStats(selectedCourse.id, dateString);
      setAttendanceStats(stats);

      // Update calendar data
      const calendarData = await getCourseAttendanceDates(selectedCourse.id);
      setCalendarData(calendarData);

      console.log('Attendance marked successfully');
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Failed to mark attendance. Please try again.');
    }
  };

  const handleBulkMarkPresent = async () => {
    if (!selectedCourse?.id || enrolledStudents.length === 0) return;

    const dateString = formatDateForStorage(selectedDate);

    try {
      const studentIds = enrolledStudents.map(s => s.id).filter(Boolean) as string[];
      await bulkCreateAttendanceRecords(selectedCourse.id, dateString, studentIds, 'present');

      // Reload data
      const records = await getAttendanceRecordsForCourseDate(selectedCourse.id, dateString);
      setAttendanceRecords(records);

      const stats = await getCourseDateAttendanceStats(selectedCourse.id, dateString);
      setAttendanceStats(stats);

      // Update calendar data
      const calendarData = await getCourseAttendanceDates(selectedCourse.id);
      setCalendarData(calendarData);

      alert('All students marked as present!');
    } catch (error) {
      console.error('Error bulk marking attendance:', error);
      alert('Failed to bulk mark attendance. Please try again.');
    }
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setCurrentView('course-selection');
    setAttendanceRecords([]);
    setAttendanceStats({ total: 0, present: 0, absent: 0, late: 0, excused: 0 });
    setCalendarData({});
  };

  const handleBackToCalendar = () => {
    setCurrentView('calendar-view');
    setAttendanceRecords([]);
    setAttendanceStats({ total: 0, present: 0, absent: 0, late: 0, excused: 0 });
  };

  const handleViewStudentHistory = async (course: Course) => {
    if (!user) return;

    setSelectedCourse(course);
    setCurrentView('student-history');

    try {
      const [records, percentage, calendarData] = await Promise.all([
        getStudentCourseAttendanceRecords(user.uid, course.id!),
        calculateStudentCourseAttendancePercentage(user.uid, course.id!),
        getStudentCourseAttendanceCalendar(user.uid, course.id!)
      ]);

      setStudentAttendance(records);
      setAttendancePercentage(percentage);
      // Convert status-based calendar data to boolean values
      const booleanCalendarData: { [dateString: string]: boolean } = {};
      Object.keys(calendarData).forEach(date => {
        booleanCalendarData[date] = true; // Any attendance record means attendance was taken
      });
      setStudentCalendarData(booleanCalendarData);
    } catch (error) {
      console.error('Error loading student attendance history:', error);
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
      console.error('Error fixing user uids:', error);
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
    : allCourses.filter(course => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (course.title || '').toLowerCase().includes(query) ||
               (course.code || '').toLowerCase().includes(query);
      });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600">Loading attendance system...</span>
        </div>
      </div>
    );
  }

  // Admin/Teacher View
  if (role === 'admin' || role === 'teacher') {
    if (currentView === 'calendar-view' && selectedCourse) {
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Attendance Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Daily Statistics</CardTitle>
                <p className="text-sm text-gray-600">{selectedDate.toLocaleDateString()}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{attendanceStats.total}</div>
                    <div className="text-sm text-gray-600">Total Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{attendanceStats.present}</div>
                    <div className="text-sm text-gray-600">Present</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{attendanceStats.absent}</div>
                    <div className="text-sm text-gray-600">Absent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{attendanceStats.late}</div>
                    <div className="text-sm text-gray-600">Late</div>
                  </div>
                </div>

                <Button
                  onClick={handleBulkMarkPresent}
                  className="w-full"
                  variant="outline"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark All Present
                </Button>
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
                      const record = attendanceRecords.find(r => r.studentId === student.id);

                      return (
                        <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-gray-600">{student.email}</div>
                          </div>
                          <div className="flex gap-2">
                            {record ? (
                              <div className="flex items-center gap-2">
                                {getAttendanceStatusBadge(record.status)}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleMarkAttendance(student.id!, 'present')}
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
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <CheckCircle className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleMarkAttendance(student.id!, 'absent')}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <XCircle className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleMarkAttendance(student.id!, 'late')}
                                  className="text-yellow-600 hover:text-yellow-700"
                                >
                                  <Clock className="h-3 w-3" />
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{filteredCourses.length}</div>
                  <div className="text-sm text-gray-600">Total Courses</div>
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
                  <div className="text-sm text-gray-600">Students</div>
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
                  <div className="text-sm text-gray-600">Current Semester</div>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {filteredCourses.reduce((total, course) => total + (course?.capacity || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Capacity</div>
                </div>
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {role === 'teacher' ? 'My Courses' : 'All Courses'}
              </CardTitle>
              <div className="flex gap-2">
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
                          console.error('Error fetching teacher assignments:', error);
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
                          console.error('Error creating sample assignments:', error);
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
                          console.error('Error checking database state:', error);
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
                          console.error('Error fetching enrollments:', error);
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
                          console.error('Error creating sample enrollments:', error);
                          alert('Error creating sample enrollments');
                        }
                      }}
                      className="text-orange-600 border-orange-200 hover:bg-orange-50"
                    >
                      Create Sample Enrollments
                    </Button>
                  </>
                )}
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCourses.map((course) => {
                if (!course) return null;
                const courseEnrollments = allCourses.find(c => c.id === course.id);
                const enrollmentCount = courseEnrollments ? course.capacity : 0; // This would need to be calculated properly

                return (
                  <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{course.title}</h3>
                          <p className="text-sm text-gray-600">{course.code} • {course.semester}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        Instructor: {course.instructor} • Capacity: {course.capacity}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSelectCourse(course)}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Mark Attendance
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSelectCourse(course)}
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Records
                      </Button>
                    </div>
                  </div>
                );
              })}

              {filteredCourses.length === 0 && (
                <div className="text-center py-8">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                  <p className="text-gray-600">
                    {role === 'teacher'
                      ? "You haven't been assigned to teach any courses yet."
                      : "No courses are available in the system."
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Student View
  if (role === 'student' && user) {
    if (currentView === 'calendar-view' && selectedCourse) {
      return (
        <div className="space-y-6">
          <PageHeader
            title={`My Attendance - ${selectedCourse.title}`}
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
                  <div className="text-sm text-gray-600">My Attendance</div>
                  <div className="font-medium text-blue-600">{attendancePercentage}%</div>
                </div>
              </CardContent>
            </Card>

            {/* Calendar */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">My Attendance Calendar</CardTitle>
                <p className="text-sm text-gray-600">View your attendance record for this course</p>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  selectedDate={selectedDate}
                  onDateSelect={() => {}} // Read-only for students
                  attendanceData={studentCalendarData}
                  showAttendanceStats={false}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    // Student Course Selection (Default)
    return (
      <div className="space-y-6">
        <PageHeader
          title="My Attendance"
          breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Attendance' }]}
        />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{filteredCourses.length}</div>
                  <div className="text-sm text-gray-600">My Courses</div>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{attendancePercentage}%</div>
                  <div className="text-sm text-gray-600">Overall Attendance</div>
                </div>
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {studentAttendance.filter(r => r.status === 'present').length}
                  </div>
                  <div className="text-sm text-gray-600">Present Days</div>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {studentAttendance.filter(r => r.status === 'absent').length}
                  </div>
                  <div className="text-sm text-gray-600">Absent Days</div>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Courses */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>My Courses</CardTitle>
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCourses.map((course) => {
                if (!course) return null;
                // Calculate attendance percentage for this course
                const courseAttendance = studentAttendance.filter(r => r.courseId === course.id);
                const coursePercentage = courseAttendance.length > 0
                  ? Math.round((courseAttendance.filter(r => r.status === 'present' || r.status === 'late').length / courseAttendance.length) * 100)
                  : 100;

                return (
                  <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{course.title}</h3>
                          <p className="text-sm text-gray-600">{course.code} • {course.semester}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        Instructor: {course.instructor} • My Attendance: <span className={`font-medium ${coursePercentage >= 75 ? 'text-green-600' : coursePercentage >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>{coursePercentage}%</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewStudentHistory(course)}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        View Calendar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewStudentHistory(course)}
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                );
              })}

              {filteredCourses.length === 0 && (
                <div className="text-center py-8">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                  <p className="text-gray-600">You are not enrolled in any courses yet.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
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


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      xs  