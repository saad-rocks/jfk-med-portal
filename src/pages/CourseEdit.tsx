import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";
import { useRole } from "../hooks/useRole";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { updateCourse } from "../lib/coursesSecure";
import { getCourseById } from "../lib/enrollments";

export default function CourseEdit() {
  const navigate = useNavigate();
  const { role, user } = useRole();
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [form, setForm] = useState({
    code: "",
    title: "",
    credits: 0,
    semester: "MD-1",
    instructor: "",
    description: "",
  });

  useEffect(() => {
    const run = async () => {
      if (!courseId) return;
      setLoading(true);
      try {
        const c = await getCourseById(courseId);
        if (c) {
          setForm({
            code: String((c as any).code || ""),
            title: String((c as any).title || ""),
            credits: Number((c as any).credits || 0),
            semester: String((c as any).semester || "MD-1"),
            instructor: String((c as any).instructor || ""),
            description: String((c as any).description || ""),
          });
          if (user?.uid) {
            setIsOwner(String((c as any).ownerId) === user.uid);
          } else {
            setIsOwner(false);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [courseId]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) return;
    setSubmitting(true);
    try {
      await updateCourse(courseId, {
        code: form.code.trim(),
        title: form.title.trim(),
        credits: Number(form.credits),
        semester: form.semester,
        instructor: form.instructor,
        description: form.description.trim(),
      });
      navigate(`/courses/${courseId}`, { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  if (!(role === 'admin' || role === 'teacher')) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Course" breadcrumb={[{ label: 'Courses', to: '/courses' }, { label: 'Edit' }]} />
        <Card><CardContent className="p-6">Only admins and teachers can edit courses.</CardContent></Card>
      </div>
    );
  }

  if (role === 'teacher' && !isOwner) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Course" breadcrumb={[{ label: 'Courses', to: '/courses' }, { label: 'Edit' }]} />
        <Card><CardContent className="p-6">Only the course owner (or an admin) can edit this course.</CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Course" breadcrumb={[{ label: 'Courses', to: '/courses' }, { label: courseId || 'Course' }, { label: 'Edit' }]} />
      {loading ? (
        <div className="h-40 rounded-xl bg-slate-100 animate-pulse" />
      ) : (
        <Card>
          <CardContent className="p-6">
            <form onSubmit={onSubmit} className="space-y-6 max-w-3xl">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Course Code *</label>
                  <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Course Title *</label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Credits *</label>
                  <Input type="number" min={0} value={form.credits} onChange={(e) => setForm({ ...form, credits: Number(e.target.value) })} required />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Semester *</label>
                  <select className="w-full h-11 border-2 border-slate-200 rounded-xl px-3" value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })}>
                    {Array.from({ length: 11 }, (_, i) => `MD-${i + 1}`).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Instructor</label>
                <Input value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })} placeholder="Instructor email or name" />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Description *</label>
                <textarea className="w-full border-2 border-slate-200 rounded-xl px-3 py-3 focus:border-blue-400 focus:outline-none resize-none" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={submitting}>Cancel</Button>
                <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save Changes"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
