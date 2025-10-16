import { useEffect, useMemo, useState } from "react";
import {
  createEnrollment,
  deleteEnrollment,
  listEnrollments,
  type Enrollment,
  type EnrollmentStatus,
  updateEnrollmentStatus,
} from "../lib/enrollments";
import { listCourses } from "../lib/courses";
import type { Course } from "../types";
import { getAllUsers, type UserProfile } from "../lib/users";
import { useRole } from "../hooks/useRole";
import { PageHeader } from "../components/layout/PageHeader";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  BookOpen,
  GraduationCap,
  Loader2,
  Plus,
  Search,
  SlidersHorizontal,
  UserMinus,
  Users,
} from "lucide-react";

type CourseWithStats = Course & {
  id: string;
  total: number;
  active: number;
  completed: number;
  dropped: number;
};

const SEMESTER_FALLBACK = "MD-1";

export default function Enrollments() {
  const { role, loading } = useRole();
  const isAdmin = role === "admin";

  const [courses, setCourses] = useState<CourseWithStats[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [enrollments, setEnrollments] = useState<Array<Enrollment & { id: string }>>([]);

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [courseSearch, setCourseSearch] = useState("");
  const [studentFilter, setStudentFilter] = useState("");

  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [createStatus, setCreateStatus] = useState<EnrollmentStatus>("enrolled");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;

    let mounted = true;
    (async () => {
      try {
        const [courseDocs, userProfiles, enrollmentDocs] = await Promise.all([
          listCourses(),
          getAllUsers(),
          listEnrollments({}),
        ]);

        if (!mounted) return;

        setUsers(userProfiles || []);
        setEnrollments(enrollmentDocs || []);

        const statsByCourse: Record<string, Omit<CourseWithStats, keyof Course | "id">> = {};
        enrollmentDocs.forEach((enrollment) => {
          if (!statsByCourse[enrollment.courseId]) {
            statsByCourse[enrollment.courseId] = {
              total: 0,
              active: 0,
              completed: 0,
              dropped: 0,
            };
          }
          const bucket = statsByCourse[enrollment.courseId];
          bucket.total += 1;
          if (enrollment.status === "completed") bucket.completed += 1;
          else if (enrollment.status === "dropped") bucket.dropped += 1;
          else bucket.active += 1;
        });

        setCourses(
          (courseDocs ?? []).map((course) => {
            const stats = statsByCourse[course.id] ?? { total: 0, active: 0, completed: 0, dropped: 0 };
            return { ...course, ...stats };
          }),
        );

        if (courseDocs.length > 0) {
          setSelectedCourseId((current) => current ?? courseDocs[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load enrollment data");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [loading]);

  useEffect(() => {
    if (!selectedCourseId && courses.length > 0) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses, selectedCourseId]);

  const { studentsById, studentsByUid } = useMemo(() => {
    const byId: Record<string, UserProfile> = {};
    const byUid: Record<string, UserProfile> = {};
    users.forEach((user) => {
      if (!user) return;
      if (user.id) {
        byId[user.id] = user;
      }
      if (user.uid) {
        byUid[user.uid] = user;
      }
    });
    return { studentsById: byId, studentsByUid: byUid };
  }, [users]);

  const students = useMemo(
    () => users.filter((user) => user.role === "student" && user.id),
    [users],
  );

  const filteredCourses = useMemo(() => {
    const query = courseSearch.trim().toLowerCase();

    return courses
      .filter((course) => {
        if (!query) return true;
        const combined = `${course.code ?? ""} ${course.title ?? ""}`.toLowerCase();
        return combined.includes(query);
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [courses, courseSearch]);

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === selectedCourseId) ?? null,
    [courses, selectedCourseId],
  );

  const enrollmentsForCourse = useMemo(() => {
    if (!selectedCourseId) return [];
    return enrollments
      .filter((enrollment) => enrollment.courseId === selectedCourseId)
      .map((enrollment) => {
        const student =
          studentsById[enrollment.studentId] ?? studentsByUid[enrollment.studentId];
        const displayName =
          student?.name && student.name.trim().length > 0
            ? student.name
            : student?.email ?? enrollment.studentId;
        return {
          ...enrollment,
          student,
          resolvedStudentId: student?.id ?? enrollment.studentId,
          displayName,
          displayEmail: student?.email ?? "",
        };
      })
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [enrollments, selectedCourseId, studentsById, studentsByUid]);

  const filteredEnrollments = useMemo(() => {
    const query = studentFilter.trim().toLowerCase();
    if (!query) return enrollmentsForCourse;

    return enrollmentsForCourse.filter((enrollment) => {
      const composite = `${enrollment.displayName} ${enrollment.resolvedStudentId} ${enrollment.displayEmail}`.toLowerCase();
      return composite.includes(query);
    });
  }, [enrollmentsForCourse, studentFilter]);

  const suggestedStudents = useMemo(() => {
    if (!selectedCourseId) return [];
    const enrolledSet = new Set(
      enrollmentsForCourse.map((enrollment) => enrollment.resolvedStudentId),
    );
    const query = studentSearch.trim().toLowerCase();

    return students
      .filter((student) => student.id)
      .filter((student) => !enrolledSet.has(student.id ?? ""))
      .filter((student) => {
        if (!query) return true;
        const composite = `${student.name ?? ""} ${student.email ?? ""} ${student.uid ?? ""} ${student.id ?? ""}`.toLowerCase();
        return composite.includes(query);
      })
      .slice(0, 8);
  }, [students, enrollmentsForCourse, selectedCourseId, studentSearch]);

  function resetMessages() {
    setFeedback(null);
    setError(null);
  }

  function handleFindStudent() {
    resetMessages();
    const value = studentSearch.trim();
    if (!value) return;

    const normalized = value.toLowerCase();
    const match = students.find((student) => {
      const docId = student.id?.toLowerCase();
      const uid = student.uid?.toLowerCase();
      const email = student.email?.toLowerCase();
      const name = student.name?.toLowerCase();
      return (
        (docId && docId === normalized) ||
        (uid && uid === normalized) ||
        (email && email === normalized) ||
        (name && name.includes(normalized))
      );
    });

    if (!match?.id) {
      setError("Student not found in the portal. Only registered students can be enrolled.");
      return;
    }

    setSelectedStudentId(match.id);
    setStudentSearch(match.email ?? match.name ?? match.id);
    setFeedback("Student located. Ready to enroll.");
  }

  async function handleCreateEnrollment(e?: React.FormEvent) {
    e?.preventDefault();
    resetMessages();

    if (!isAdmin) {
      setError("Only administrators can manage enrollments.");
      return;
    }

    if (!selectedCourse || !selectedCourseId) {
      setError("Select a course first.");
      return;
    }

    if (!selectedStudentId) {
      setError("Select or search for a student to enroll.");
      return;
    }

    const studentRecord =
      studentsById[selectedStudentId] ?? studentsByUid[selectedStudentId];
    if (!studentRecord?.id) {
      setError("Selected student is not registered on the portal.");
      return;
    }

    const alreadyEnrolled = enrollmentsForCourse.some(
      (enrollment) => enrollment.resolvedStudentId === studentRecord.id,
    );
    if (alreadyEnrolled) {
      setError("This student is already enrolled in the course.");
      return;
    }

    setIsSubmitting(true);

    try {
      const newId = await createEnrollment({
        studentId: studentRecord.id,
        courseId: selectedCourseId,
        semesterId: selectedCourse.semester ?? SEMESTER_FALLBACK,
        status: createStatus,
      });

      const enrollmentRecord: Enrollment & { id: string } = {
        id: newId,
        studentId: studentRecord.id,
        courseId: selectedCourseId,
        semesterId: selectedCourse.semester ?? SEMESTER_FALLBACK,
        status: createStatus,
        enrolledAt: Date.now(),
        createdAt: Date.now(),
      };

      setEnrollments((prev) => [...prev, enrollmentRecord]);
      setSelectedStudentId("");
      setStudentSearch("");
      setCreateStatus("enrolled");
      setFeedback("Student enrolled successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create enrollment");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRemoveEnrollment(enrollmentId: string) {
    resetMessages();
    if (!isAdmin) {
      setError("Only administrators can manage enrollments.");
      return;
    }

    setIsSubmitting(true);
    try {
      await deleteEnrollment(enrollmentId);
      setEnrollments((prev) => prev.filter((enrollment) => enrollment.id !== enrollmentId));
      setFeedback("Student removed from course.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove student");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateStatus(enrollmentId: string, status: EnrollmentStatus) {
    resetMessages();
    if (!isAdmin) {
      setError("Only administrators can manage enrollments.");
      return;
    }

    try {
      await updateEnrollmentStatus(enrollmentId, status);
      setEnrollments((prev) =>
        prev.map((enrollment) => (enrollment.id === enrollmentId ? { ...enrollment, status } : enrollment)),
      );
      setFeedback("Enrollment status updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update enrollment");
    }
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-6 py-4 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <span className="text-slate-600">Loading enrollment dashboard…</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <PageHeader title="Enrollments" breadcrumb={[{ label: "Home", to: "/" }, { label: "Enrollments" }]} />
        <p className="text-sm text-slate-600">
          Manage course enrollments for students across the program.
        </p>
        <Card>
          <CardHeader>
            <CardTitle>Access Restricted</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">
              You need administrative privileges to manage enrollments. Contact your system administrator if you need
              access.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Enrollments" breadcrumb={[{ label: "Home", to: "/" }, { label: "Enrollments" }]} />
      <p className="text-sm text-slate-600">
        View courses, track enrollment status, and manage student assignments in one place.
      </p>

      {(error || feedback) && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm shadow-sm ${
            error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {error ?? feedback}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,340px),minmax(0,1fr)]">
        <section className="space-y-4">
          <Card className="shadow-soft border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Courses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  value={courseSearch}
                  onChange={(event) => setCourseSearch(event.target.value)}
                  placeholder="Search courses by code or title…"
                  className="pl-10"
                />
              </div>

              <div className="max-h-[560px] space-y-3 overflow-y-auto pr-1">
                {filteredCourses.length === 0 && (
                  <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                    No courses found. Adjust your search.
                  </div>
                )}

                {filteredCourses.map((course) => {
                  const isActive = course.id === selectedCourseId;
                  return (
                    <button
                      key={course.id}
                      onClick={() => setSelectedCourseId(course.id)}
                      className={`w-full rounded-xl border px-4 py-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                        isActive
                          ? "border-blue-500 bg-blue-50/70"
                          : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{course.code}</p>
                          <p className="mt-1 text-sm font-semibold text-slate-900">{course.title}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Badge variant="secondary" className="flex items-center gap-1 text-xs font-semibold">
                              <Users className="h-3 w-3" />
                              {course.total} enrolled
                            </Badge>
                            <Badge variant="success" className="text-xs">
                              Active {course.active}
                            </Badge>
                            {course.completed > 0 && (
                              <Badge variant="outline" className="text-xs">
                                Completed {course.completed}
                              </Badge>
                            )}
                            {course.dropped > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                Dropped {course.dropped}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Badge variant="outline" className="mt-1 text-xs font-medium">
                          {course.semester ?? SEMESTER_FALLBACK}
                        </Badge>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-gradient-to-br from-blue-50/60 via-white to-emerald-50/60 shadow-soft">
            <CardContent className="space-y-4 py-5">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-blue-100 p-3">
                  <GraduationCap className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Program Snapshot</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {courses.length} courses, {students.length} students loaded
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-slate-200/80 bg-white px-3 py-2">
                  <p className="text-xs text-slate-500">Most Enrolled Course</p>
                  <p className="truncate font-semibold text-slate-900">
                    {courses.length > 0
                      ? courses.reduce((prev, current) => (current.total > prev.total ? current : prev)).title
                      : "—"}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200/80 bg-white px-3 py-2">
                  <p className="text-xs text-slate-500">Active Enrollments</p>
                  <p className="font-semibold text-slate-900">
                    {enrollments.filter((enrollment) => enrollment.status === "enrolled").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <Card className="shadow-soft border-slate-200">
            <CardHeader className="flex flex-col gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <Users className="h-5 w-5 text-blue-600" />
                  {selectedCourse ? selectedCourse.title : "Select a course"}
                </CardTitle>
                {selectedCourse && (
                  <p className="text-sm text-slate-600">
                    {selectedCourse.code} • Semester {selectedCourse.semester ?? SEMESTER_FALLBACK}
                  </p>
                )}
              </div>
              {selectedCourse && (
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <Badge variant="success">Active {selectedCourse.active}</Badge>
                  <Badge variant="outline">Completed {selectedCourse.completed}</Badge>
                  <Badge variant="destructive">Dropped {selectedCourse.dropped}</Badge>
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              {selectedCourse ? (
                <>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3">
                    <p className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <SlidersHorizontal className="h-4 w-4 text-blue-600" />
                      Enroll a student
                    </p>
                    <form className="mt-3 space-y-3" onSubmit={handleCreateEnrollment}>
                      <div className="grid gap-3 md:grid-cols-[minmax(0,2fr),minmax(0,1fr)] md:items-center">
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            value={studentSearch}
                            onChange={(event) => setStudentSearch(event.target.value)}
                            placeholder="Search by student name, email, or UID"
                            className="pl-10"
                          />
                        </div>
                        <div className="flex gap-2 md:justify-end">
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={handleFindStudent}
                            className="gap-2"
                          >
                            <Search className="h-4 w-4" />
                            Find Student
                          </Button>
                          <Button type="submit" disabled={isSubmitting} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Enroll
                          </Button>
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr),minmax(0,180px)] md:items-center">
                        <div className="text-sm text-slate-600">
                          {selectedStudentId ? (
                            <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 px-3 py-2 text-emerald-700">
                              {(
                                studentsById[selectedStudentId] ??
                                studentsByUid[selectedStudentId]
                              )?.name ?? selectedStudentId}
                            </div>
                          ) : (
                            <span className="text-slate-500">Select a student to enable enrollment.</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <label htmlFor="enrollment-status" className="text-xs font-medium text-slate-500">
                            Status
                          </label>
                          <select
                            id="enrollment-status"
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                            value={createStatus}
                            onChange={(event) => setCreateStatus(event.target.value as EnrollmentStatus)}
                          >
                            <option value="enrolled">Enrolled</option>
                            <option value="completed">Completed</option>
                            <option value="dropped">Dropped</option>
                          </select>
                        </div>
                      </div>
                    </form>

                    {suggestedStudents.length > 0 && (
                      <div className="mt-4 space-y-2 rounded-lg border border-dashed border-slate-200 bg-white/60 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Suggested students
                        </p>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {suggestedStudents.map((student) => (
                            <div
                              key={student.id ?? student.uid ?? student.email ?? student.name}
                              className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                            >
                              <div className="min-w-0">
                                <p className="truncate font-medium text-slate-800">{student.name}</p>
                                <p className="truncate text-xs text-slate-500">{student.email}</p>
                              </div>
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                  if (!student.id) return;
                                  setSelectedStudentId(student.id);
                                  setStudentSearch(student.email ?? student.name ?? student.id);
                                  setFeedback("Student ready to enroll.");
                                }}
                                className="h-7 gap-1 px-3 text-xs"
                              >
                                <Plus className="h-3.5 w-3.5" />
                                Select
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-base font-semibold text-slate-900">Enrolled students</h3>
                      <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          value={studentFilter}
                          onChange={(event) => setStudentFilter(event.target.value)}
                          placeholder="Filter by name or email"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {filteredEnrollments.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
                        <Users className="mx-auto h-10 w-10 text-slate-300" />
                        <p className="mt-3 text-sm font-medium text-slate-700">No students enrolled yet.</p>
                        <p className="text-xs text-slate-500">
                          Use the form above to add students to this course.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-hidden rounded-xl border border-slate-200">
                        <div className="hidden bg-slate-50/60 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:grid sm:grid-cols-[minmax(0,2fr),minmax(0,1fr),120px,100px] sm:px-4 sm:py-2.5">
                          <span>Student</span>
                          <span>Email</span>
                          <span>Status</span>
                          <span>Actions</span>
                        </div>
                        <div className="divide-y divide-slate-200">
                          {filteredEnrollments.map((enrollment) => (
                            <div
                              key={enrollment.id}
                              className="grid gap-3 px-4 py-3 text-sm sm:grid-cols-[minmax(0,2fr),minmax(0,1fr),120px,100px] sm:items-center"
                            >
                              <div>
                                <p className="font-medium text-slate-900">{enrollment.displayName}</p>
                                {enrollment.displayEmail ? (
                                  <p className="text-xs text-slate-500">{enrollment.displayEmail}</p>
                                ) : null}
                                <p className="font-mono text-[11px] text-slate-400">{enrollment.studentId}</p>
                              </div>
                              <div>
                                <select
                                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                                  value={enrollment.status}
                                  onChange={(event) =>
                                    handleUpdateStatus(enrollment.id, event.target.value as EnrollmentStatus)
                                  }
                                >
                                  <option value="enrolled">Enrolled</option>
                                  <option value="completed">Completed</option>
                                  <option value="dropped">Dropped</option>
                                </select>
                              </div>
                              <div className="flex items-center justify-start sm:justify-end">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveEnrollment(enrollment.id)}
                                  className="gap-2 text-red-600 hover:bg-red-50"
                                  disabled={isSubmitting}
                                >
                                  <UserMinus className="h-4 w-4" />
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-10 text-center">
                  <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
                  <p className="mt-3 text-base font-semibold text-slate-800">Select a course to begin</p>
                  <p className="text-sm text-slate-500">
                    Choose a course from the list to view enrolled students and manage assignments.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
