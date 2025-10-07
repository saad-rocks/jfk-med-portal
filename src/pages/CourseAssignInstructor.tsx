import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { getCourseById } from "../lib/enrollments";
import { getAllUsers, type UserProfile } from "../lib/users";
import { assignTeacherToCourse } from "../lib/teacherAssignments";
import { useRole } from "../hooks/useRole";

export default function CourseAssignInstructor() {
  const navigate = useNavigate();
  const { role } = useRole();
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<any>(null);
  const [teachers, setTeachers] = useState<UserProfile[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (!courseId) return;
      setLoading(true);
      try {
        const c = await getCourseById(courseId);
        setCourse(c);
        const all = await getAllUsers();
        setTeachers(all.filter(u => u.role === 'teacher'));
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [courseId]);

  const onAssign = async () => {
    if (!courseId || !selected) return;
    setSubmitting(true);
    try {
      const teacher = teachers.find(t => t.id === selected);
      if (!teacher) return;
      await assignTeacherToCourse(teacher.id!, teacher.email || "", courseId);
      navigate(`/courses/${courseId}`, { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  if (role !== 'admin') {
    return (
      <div className="space-y-6">
        <PageHeader title="Assign Instructor" breadcrumb={[{ label: 'Courses', to: '/courses' }, { label: 'Assign Instructor' }]} />
        <Card><CardContent className="p-6">Only admins can assign instructors.</CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Assign Instructor" breadcrumb={[{ label: 'Courses', to: '/courses' }, { label: course ? `${(course as any).code} — ${(course as any).title}` : 'Course' }, { label: 'Assign Instructor' }]} />
      <Card>
        <CardContent className="p-6 space-y-4">
          {loading ? (
            <div className="h-40 rounded-xl bg-slate-100 animate-pulse" />
          ) : (
            <>
              <div className="text-slate-700 font-medium">{course ? `${(course as any).code} — ${(course as any).title}` : ''}</div>
              <select className="w-full h-11 border-2 border-slate-200 rounded-xl px-3" value={selected} onChange={(e) => setSelected(e.target.value)}>
                <option value="">Select a teacher</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                ))}
              </select>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => navigate(-1)} disabled={submitting}>Cancel</Button>
                <Button onClick={onAssign} disabled={!selected || submitting}>{submitting ? 'Assigning...' : 'Assign Instructor'}</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

