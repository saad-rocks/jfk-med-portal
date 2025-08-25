import { useEffect, useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";
import { createEnrollment, deleteEnrollment, listEnrollments, type Enrollment, type EnrollmentStatus, updateEnrollmentStatus } from "../lib/enrollments";
import { listCourses } from "../lib/courses";
import type { Course } from "../types";
import { getAllUsers } from "../lib/users";
import type { UserProfile } from "../lib/users";
import { PageHeader } from "../components/layout/PageHeader";
import { PageActions } from "../components/layout/PageActions";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "../components/ui/card";
import { useRole } from "../hooks/useRole";

const SEMESTERS = Array.from({ length: 11 }, (_, i) => `MD-${i + 1}`);
const STATUSES: EnrollmentStatus[] = ["enrolled", "dropped", "completed"];

export default function Enrollments() {
  const { role, loading } = useRole();
  const [error, setError] = useState<string | null>(null);

  const [courses, setCourses] = useState<Array<Course & { id: string }>>([]);
  const [users, setUsers] = useState<Array<UserProfile>>([]);
  const [enrollments, setEnrollments] = useState<Array<(Enrollment & { id: string })>>([]);

  const [studentSearch, setStudentSearch] = useState<string>("");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>("MD-1");
  const [createStatus, setCreateStatus] = useState<EnrollmentStatus>("enrolled");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [filterCourseId, setFilterCourseId] = useState<string>("");
  const [filterSemesterId, setFilterSemesterId] = useState<string>("");

  const isAdmin = role === "admin";

  // Create lookup maps for quick name retrieval - with safe fallbacks
  const studentNameMap = (users || []).reduce((map, user) => {
    if (user && user.uid && user.name) {
      map[user.uid] = user.name;
    }
    return map;
  }, {} as Record<string, string>);

  const courseNameMap = (courses || []).reduce((map, course) => {
    if (course && course.id && course.code && course.title) {
      map[course.id] = `${course.code} - ${course.title}`;
    }
    return map;
  }, {} as Record<string, string>);

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
  } catch (debugError) {
    console.error('Debug logging error:', debugError);
  }

  useEffect(() => {
    if (!loading) {
      (async () => {
        try {
          console.log('🚀 Starting to load data...');
          const [cs, us, es] = await Promise.all([
            listCourses(),
            getAllUsers(),
            listEnrollments({}),
          ]);
          console.log('✅ Data loaded successfully:', { courses: cs.length, users: us.length, enrollments: es.length });
          setCourses(cs || []);
          setUsers(us || []);
          setEnrollments(es || []);
        } catch (e: unknown) {
          const error = e as Error;
          console.error('❌ Error loading data:', error);
          setError(error?.message ?? "Failed to load data");
          // Set empty arrays to prevent crashes
          setCourses([]);
          setUsers([]);
          setEnrollments([]);
        }
      })();
    }
  }, [loading]);

  async function handleFindStudent() {
    setError(null);
    const value = studentSearch.trim();
    if (!value) return;
    if (value.includes("@")) {
      try {
        const callable = httpsCallable(functions, "findUserByEmailOrUid");
        const res = await callable({ emailOrUid: value });
        setSelectedStudentId((res.data as { uid: string }).uid);
      } catch (e: unknown) {
        const error = e as Error;
        setError(error?.message ?? "User not found");
      }
    } else {
      setSelectedStudentId(value);
    }
  }

  async function handleCreateEnrollment(e: React.FormEvent) {
    e.preventDefault();
    if (!isAdmin || isSubmitting) return;
    
    if (!selectedStudentId || !selectedCourseId) {
      setError("Please select both a student and a course");
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      await createEnrollment({
        studentId: selectedStudentId,
        courseId: selectedCourseId,
        semesterId: selectedSemesterId,
        status: createStatus,
      });
      const [es, us] = await Promise.all([
        listEnrollments({ courseId: filterCourseId || undefined, semesterId: filterSemesterId || undefined }),
        getAllUsers()
      ]);
      setEnrollments(es);
      setUsers(us);
      setSelectedCourseId("");
      setSelectedSemesterId("MD-1");
      setCreateStatus("enrolled");
      setSelectedStudentId("");
      setStudentSearch("");
    } catch (e: unknown) {
      const error = e as Error;
      setError(error?.message ?? "Failed to create enrollment");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateStatus(id: string, status: EnrollmentStatus) {
    try {
      await updateEnrollmentStatus(id, status);
      const es = await listEnrollments({ courseId: filterCourseId || undefined, semesterId: filterSemesterId || undefined });
      setEnrollments(es);
    } catch (e: unknown) {
      const error = e as Error;
      setError(error?.message ?? "Failed to update status");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteEnrollment(id);
      const es = await listEnrollments({ courseId: filterCourseId || undefined, semesterId: filterSemesterId || undefined });
      setEnrollments(es);
    } catch (e: unknown) {
      const error = e as Error;
      setError(error?.message ?? "Failed to delete enrollment");
    }
  }

  async function applyFilters() {
    const es = await listEnrollments({ courseId: filterCourseId || undefined, semesterId: filterSemesterId || undefined });
    setEnrollments(es);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600">Loading enrollments...</span>
        </div>
      </div>
    );
  }

  // Error boundary for rendering issues
  try {

  if (!isAdmin) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Access Denied</h3>
          <p className="text-gray-600">You need admin privileges to access the enrollments page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader
        title="Enrollments"
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Enrollments' }]}
        actions={<PageActions><Button variant="outline" onClick={() => document.querySelector('#assign-form')?.scrollIntoView({ behavior: 'smooth' })}>Assign Student</Button></PageActions>}
      />
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-red-800">Error</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <Card id="assign-form" className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            Assign Student to Course
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateEnrollment} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Student Search */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">
                  Student (UID or Email)
                </label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      placeholder="Enter student UID or email address"
                      className="h-12"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleFindStudent}
                    variant="outline"
                    size="md"
                    className="h-12 px-6 whitespace-nowrap"
                  >
                    Find Student
                  </Button>
                </div>
                {selectedStudentId && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-700">
                      Selected: {selectedStudentId}
                    </span>
                  </div>
                )}
              </div>

              {/* Course Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">
                  Course
                </label>
                <select 
                  className="w-full h-12 border-2 border-slate-200 rounded-xl px-4 bg-white/50 backdrop-blur-sm focus:border-blue-400 focus:bg-white transition-all duration-300 hover:border-slate-300"
                  value={selectedCourseId} 
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                >
                  <option value="">Select a course...</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.code} — {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Semester Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">
                  Semester
                </label>
                <select 
                  className="w-full h-12 border-2 border-slate-200 rounded-xl px-4 bg-white/50 backdrop-blur-sm focus:border-blue-400 focus:bg-white transition-all duration-300 hover:border-slate-300"
                  value={selectedSemesterId} 
                  onChange={(e) => setSelectedSemesterId(e.target.value)}
                >
                  {SEMESTERS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Status Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">
                  Initial Status
                </label>
                <select 
                  className="w-full h-12 border-2 border-slate-200 rounded-xl px-4 bg-white/50 backdrop-blur-sm focus:border-blue-400 focus:bg-white transition-all duration-300 hover:border-slate-300"
                  value={createStatus} 
                  onChange={(e) => setCreateStatus(e.target.value as EnrollmentStatus)}
                >
                  {STATUSES.map(s => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting || !selectedStudentId || !selectedCourseId}
                className="min-w-[140px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Assigning...
                  </div>
                ) : (
                  "Assign Student"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-slate-500 to-slate-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            Filter Enrollments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">
                Course
              </label>
              <select 
                className="w-full h-12 border-2 border-slate-200 rounded-xl px-4 bg-white/50 backdrop-blur-sm focus:border-blue-400 focus:bg-white transition-all duration-300 hover:border-slate-300"
                value={filterCourseId} 
                onChange={(e) => setFilterCourseId(e.target.value)}
              >
                <option value="">All Courses</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.title}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">
                Semester
              </label>
              <select 
                className="w-full h-12 border-2 border-slate-200 rounded-xl px-4 bg-white/50 backdrop-blur-sm focus:border-blue-400 focus:bg-white transition-all duration-300 hover:border-slate-300"
                value={filterSemesterId} 
                onChange={(e) => setFilterSemesterId(e.target.value)}
              >
                <option value="">All Semesters</option>
                {SEMESTERS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <Button
                onClick={applyFilters}
                variant="outline"
                size="lg"
                className="w-full h-12"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            All Enrollments
            <div className="ml-auto px-3 py-1 bg-slate-100 rounded-full text-sm font-medium text-slate-600">
              {enrollments.length} total
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {enrollments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No enrollments found</h3>
              <p className="text-slate-600 mb-4">Get started by assigning a student to a course above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-4 px-4 font-semibold text-slate-700">Student</th>
                      <th className="text-left py-4 px-4 font-semibold text-slate-700">Course</th>
                      <th className="text-left py-4 px-4 font-semibold text-slate-700">Semester</th>
                      <th className="text-left py-4 px-4 font-semibold text-slate-700">Status</th>
                      <th className="text-left py-4 px-4 font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.map(e => (
                      <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="font-medium text-slate-800">
                              {studentNameMap[e.studentId] || 'Unknown Student'}
                            </div>
                            <div className="font-mono text-xs text-slate-500">
                              {e.studentId}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="font-medium text-slate-800">
                              {courseNameMap[e.courseId] || 'Unknown Course'}
                            </div>
                            <div className="font-mono text-xs text-slate-500">
                              {e.courseId}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {e.semesterId}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <select 
                            className="h-9 border-2 border-slate-200 rounded-lg px-3 bg-white focus:border-blue-400 transition-colors text-sm"
                            value={e.status} 
                            onChange={(ev) => handleUpdateStatus(e.id, ev.target.value as EnrollmentStatus)}
                          >
                            {STATUSES.map(s => (
                              <option key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-4 px-4">
                          <Button
                            onClick={() => handleDelete(e.id)}
                            variant="danger"
                            size="sm"
                            className="h-9"
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {enrollments.map(e => (
                  <div key={e.id} className="border border-slate-200 rounded-2xl p-4 bg-white shadow-soft">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-xs font-medium text-slate-500 mb-1">Student</p>
                          <div className="space-y-1">
                            <div className="font-medium text-slate-800">
                              {studentNameMap[e.studentId] || 'Unknown Student'}
                            </div>
                            <div className="font-mono text-xs text-slate-500">
                              {e.studentId}
                            </div>
                          </div>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {e.semesterId}
                        </span>
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium text-slate-500 mb-1">Course</p>
                        <div className="space-y-1">
                          <div className="font-medium text-slate-800">
                            {courseNameMap[e.courseId] || 'Unknown Course'}
                          </div>
                          <div className="font-mono text-xs text-slate-500">
                            {e.courseId}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 pt-2">
                        <div className="flex-1">
                          <p className="text-xs font-medium text-slate-500 mb-2">Status</p>
                          <select 
                            className="w-full h-10 border-2 border-slate-200 rounded-lg px-3 bg-white focus:border-blue-400 transition-colors text-sm"
                            value={e.status} 
                            onChange={(ev) => handleUpdateStatus(e.id, ev.target.value as EnrollmentStatus)}
                          >
                            {STATUSES.map(s => (
                              <option key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-end">
                          <Button
                            onClick={() => handleDelete(e.id)}
                            variant="danger"
                            size="sm"
                            className="h-10 px-4"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  } catch (renderError) {
    console.error('❌ Enrollment component render error:', renderError);
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-4">There was an error loading the enrollments page.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
}


