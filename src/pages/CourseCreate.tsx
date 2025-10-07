import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";
import { useRole } from "../hooks/useRole";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { createCourse } from "../lib/courses";
import { getAllUsers, type UserProfile } from "../lib/users";

export default function CourseCreate() {
  const { role } = useRole();
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    code: "",
    title: "",
    credits: 3,
    semester: "MD-1",
    instructor: "",
    description: "",
  });

  useEffect(() => {
    const run = async () => {
      try {
        const users = await getAllUsers();
        setTeachers(users.filter((u) => u.role === "teacher"));
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createCourse({
        code: form.code.trim(),
        title: form.title.trim(),
        credits: Number(form.credits),
        semester: form.semester,
        instructor: form.instructor,
        description: form.description.trim(),
      });
      navigate("/courses", { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  if (!(role === 'admin' || role === 'teacher')) {
    return (
      <div className="space-y-6">
        <PageHeader title="Create Course" breadcrumb={[{ label: 'Courses', to: '/courses' }, { label: 'Create' }]} />
        <Card><CardContent className="p-6">Only admins and teachers can create courses.</CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Create Course" breadcrumb={[{ label: 'Courses', to: '/courses' }, { label: 'Create' }]} />
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
              <label className="block text-sm font-medium text-slate-700">Instructor *</label>
              {loading ? (
                <div className="w-full h-11 border-2 border-slate-200 rounded-xl px-3 flex items-center bg-white/85">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                  <span className="text-slate-500">Loading teachers...</span>
                </div>
              ) : (
                <select className="w-full h-11 border-2 border-slate-200 rounded-xl px-3" value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })} required>
                  <option value="">Select instructor</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.email || ""}>{t.name} ({t.email})</option>
                  ))}
                </select>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Description *</label>
              <textarea className="w-full border-2 border-slate-200 rounded-xl px-3 py-3 focus:border-blue-400 focus:outline-none resize-none" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={submitting}>Cancel</Button>
              <Button type="submit" disabled={submitting}>{submitting ? "Creating..." : "Create Course"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
