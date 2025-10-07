import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";
import { useRole } from "../hooks/useRole";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { getCourseById, getEnrollmentsWithStudentDetails, createEnrollment } from "../lib/enrollments";
import { getAllUsers, type UserProfile } from "../lib/users";

export default function CourseStudents() {
  const navigate = useNavigate();
  const { role } = useRole();
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<any>(null);
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [adding, setAdding] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!courseId) return;
      setLoading(true);
      try {
        const c = await getCourseById(courseId);
        setCourse(c);
        const list = await getEnrollmentsWithStudentDetails(courseId);
        setEnrolledIds(new Set(list.map((e) => e.studentId)));
        const all = await getAllUsers();
        setStudents(all.filter((u) => u.role === "student"));
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [courseId]);

  const eligible = useMemo(() => {
    if (!course) return [] as UserProfile[];
    const md = (course as any).semester as string | undefined;
    return students.filter((s) => s.id && !enrolledIds.has(s.id!) && (!md || s.mdYear === md));
  }, [students, enrolledIds, course]);

  const enroll = async (studentId: string) => {
    if (!courseId) return;
    setAdding(studentId);
    try {
      await createEnrollment({ studentId, courseId, semesterId: "current", status: "enrolled" });
      setEnrolledIds((prev) => new Set([...Array.from(prev), studentId]));
    } finally {
      setAdding(null);
    }
  };

  if (!(role === 'admin' || role === 'teacher')) {
    return (
      <div className="space-y-6">
        <PageHeader title="Add Students" breadcrumb={[{ label: 'Courses', to: '/courses' }, { label: 'Add Students' }]} />
        <Card><CardContent className="p-6">Only admins and teachers can manage students.</CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Add Students" breadcrumb={[{ label: 'Courses', to: '/courses' }, { label: course ? `${(course as any).code} — ${(course as any).title}` : 'Course' }, { label: 'Add Students' }]} />
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="text-slate-700 font-medium">
            {course ? `${(course as any).code} — ${(course as any).title}` : ""}
          </div>
          {loading ? (
            <div className="h-40 rounded-xl bg-slate-100 animate-pulse" />
          ) : eligible.length === 0 ? (
            <div className="p-6 rounded-xl border border-slate-200 bg-white text-slate-600">No eligible students found.</div>
          ) : (
            <div className="space-y-2">
              {eligible.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white">
                  <div>
                    <div className="font-semibold text-slate-800">{s.name}</div>
                    <div className="text-sm text-slate-500">{s.email} • {s.mdYear || "MD"}</div>
                  </div>
                  <Button size="sm" onClick={(e) => { e.preventDefault(); e.stopPropagation(); enroll(s.id!); }} disabled={adding === s.id}> {adding === s.id ? "Adding..." : "Add"}</Button>
                </div>
              ))}
            </div>
          )}
          <div className="pt-2">
            <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
