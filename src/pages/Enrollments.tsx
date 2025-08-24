import { useEffect, useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";
import { createEnrollment, deleteEnrollment, listEnrollments, type Enrollment, type EnrollmentStatus, updateEnrollmentStatus } from "../lib/enrollments";
import { listCourses } from "../lib/courses";
import { PageHeader } from "../components/layout/PageHeader";
import { PageActions } from "../components/layout/PageActions";
import { Button } from "../components/ui/button";
import { useRole } from "../hooks/useRole";

const SEMESTERS = Array.from({ length: 11 }, (_, i) => `MD-${i + 1}`);
const STATUSES: EnrollmentStatus[] = ["enrolled", "dropped", "completed"];

export default function Enrollments() {
  const { user, role, loading } = useRole();
  const [error, setError] = useState<string | null>(null);

  const [courses, setCourses] = useState<Array<any>>([]);
  const [enrollments, setEnrollments] = useState<Array<(Enrollment & { id: string })>>([]);

  const [studentSearch, setStudentSearch] = useState<string>("");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>("MD-1");
  const [createStatus, setCreateStatus] = useState<EnrollmentStatus>("enrolled");

  const [filterCourseId, setFilterCourseId] = useState<string>("");
  const [filterSemesterId, setFilterSemesterId] = useState<string>("");

  const isAdmin = role === "admin";

  useEffect(() => {
    if (!loading) {
      (async () => {
        try {
          const [cs, es] = await Promise.all([
            listCourses(),
            listEnrollments({}),
          ]);
          setCourses(cs);
          setEnrollments(es);
        } catch (e: any) {
          setError(e?.message ?? "Failed to load data");
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
        const res: any = await callable({ emailOrUid: value });
        setSelectedStudentId(res.data.uid);
      } catch (e: any) {
        setError(e?.message ?? "User not found");
      }
    } else {
      setSelectedStudentId(value);
    }
  }

  async function handleCreateEnrollment(e: React.FormEvent) {
    e.preventDefault();
    if (!isAdmin) return;
    setError(null);
    try {
      await createEnrollment({
        studentId: selectedStudentId,
        courseId: selectedCourseId,
        semesterId: selectedSemesterId,
        status: createStatus,
      });
      const es = await listEnrollments({ courseId: filterCourseId || undefined, semesterId: filterSemesterId || undefined });
      setEnrollments(es);
      setSelectedCourseId("");
      setSelectedSemesterId("MD-1");
      setCreateStatus("enrolled");
    } catch (e: any) {
      setError(e?.message ?? "Failed to create enrollment");
    }
  }

  async function handleUpdateStatus(id: string, status: EnrollmentStatus) {
    try {
      await updateEnrollmentStatus(id, status);
      const es = await listEnrollments({ courseId: filterCourseId || undefined, semesterId: filterSemesterId || undefined });
      setEnrollments(es);
    } catch (e: any) {
      setError(e?.message ?? "Failed to update status");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteEnrollment(id);
      const es = await listEnrollments({ courseId: filterCourseId || undefined, semesterId: filterSemesterId || undefined });
      setEnrollments(es);
    } catch (e: any) {
      setError(e?.message ?? "Failed to delete enrollment");
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
      {error && <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">{error}</div>}

      <section id="assign-form" className="mb-6 bg-white border rounded p-4">
        <h2 className="font-medium mb-3">Assign Student to Course</h2>
        <div className="grid md:grid-cols-4 gap-3 items-end">
          <label className="flex flex-col text-sm md:col-span-2">
            <span className="mb-1 font-medium">Student (UID or email)</span>
            <div className="flex gap-2">
              <input className="border rounded px-3 py-2 flex-1" value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} placeholder="uid or email" />
              <button type="button" onClick={handleFindStudent} className="px-3 py-2 rounded bg-gray-100 border">Find</button>
            </div>
            {selectedStudentId && <span className="text-xs text-gray-600 mt-1">Selected UID: {selectedStudentId}</span>}
          </label>
          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Course</span>
            <select className="border rounded px-3 py-2" value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)}>
              <option value="">Select course…</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}
            </select>
          </label>
          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Semester</span>
            <select className="border rounded px-3 py-2" value={selectedSemesterId} onChange={(e) => setSelectedSemesterId(e.target.value)}>
              {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Status</span>
            <select className="border rounded px-3 py-2" value={createStatus} onChange={(e) => setCreateStatus(e.target.value as EnrollmentStatus)}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <div>
            <button onClick={handleCreateEnrollment} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Assign</button>
          </div>
        </div>
      </section>

      <section className="mb-4 bg-white border rounded p-4">
        <h2 className="font-medium mb-3">Filters</h2>
        <div className="grid md:grid-cols-4 gap-3 items-end">
          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Course</span>
            <select className="border rounded px-3 py-2" value={filterCourseId} onChange={(e) => setFilterCourseId(e.target.value)}>
              <option value="">All</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}
            </select>
          </label>
          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Semester</span>
            <select className="border rounded px-3 py-2" value={filterSemesterId} onChange={(e) => setFilterSemesterId(e.target.value)}>
              <option value="">All</option>
              {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <div>
            <button onClick={applyFilters} className="px-4 py-2 rounded bg-gray-100 border">Apply</button>
          </div>
        </div>
      </section>

      <section className="bg-white border rounded p-4">
        <h2 className="font-medium mb-3">All Enrollments</h2>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-4">Student UID</th>
                <th className="py-2 pr-4">Course</th>
                <th className="py-2 pr-4">Semester</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map(e => (
                <tr key={e.id} className="border-b">
                  <td className="py-2 pr-4 font-mono text-xs">{e.studentId}</td>
                  <td className="py-2 pr-4 font-mono text-xs">{e.courseId}</td>
                  <td className="py-2 pr-4">{e.semesterId}</td>
                  <td className="py-2 pr-4">
                    <select className="border rounded px-2 py-1" value={e.status} onChange={(ev) => handleUpdateStatus(e.id, ev.target.value as EnrollmentStatus)}>
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="py-2 pr-4">
                    <button onClick={() => handleDelete(e.id)} className="px-3 py-1 rounded bg-red-600 text-white">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}


