import { useEffect, useMemo, useState } from "react";
import { createCourse, listCourses, type CourseInput } from "../lib/courses";
import { useToast } from "../components/ui/toast";
import { PageHeader } from "../components/layout/PageHeader";
import { PageActions } from "../components/layout/PageActions";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { X, Plus, BookOpen, Users, Clock, GraduationCap, User as UserIcon, FileText } from "lucide-react";
import { useRole } from "../hooks/useRole";

const SEMESTERS = Array.from({ length: 11 }, (_, i) => `MD-${i + 1}`);

export default function Courses() {
  const { push } = useToast();
  const { user, role, loading } = useRole();
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Array<any>>([]);
  const [query, setQuery] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState<CourseInput>({
    code: "",
    title: "",
    credits: 0,
    semester: "MD-1",
    capacity: 0,
    instructor: "",
    description: "",
  });
  const [courseInstructor, setCourseInstructor] = useState("");
  const [courseDescription, setCourseDescription] = useState("");

  const canCreate = useMemo(() => role === "admin" || role === "teacher", [role]);

  useEffect(() => {
    (async () => {
      try {
        const items = await listCourses();
        setCourses(items);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load courses");
      }
    })();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const courseData = {
        ...form,
        instructor: courseInstructor,
        description: courseDescription,
      };
      await createCourse(courseData);
      const items = await listCourses();
      setCourses(items);
      // Reset form
      setForm({ code: "", title: "", credits: 0, semester: "MD-1", capacity: 0, instructor: "", description: "" });
      setCourseInstructor("");
      setCourseDescription("");
      setShowCreateModal(false);
      push({ variant: 'success', title: 'Course created', description: `${form.code} — ${form.title}` });
    } catch (e: any) {
      setError(e?.message ?? "Failed to create course");
      push({ variant: 'error', title: 'Failed to create course', description: e?.message });
    }
  }

  function handleOpenCreateModal() {
    setShowCreateModal(true);
  }

  function handleCloseCreateModal() {
    setShowCreateModal(false);
    // Reset form
    setForm({ code: "", title: "", credits: 0, semester: "MD-1", capacity: 0, instructor: "", description: "" });
    setCourseInstructor("");
    setCourseDescription("");
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader
        title="Courses"
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Courses' }]}
        actions={
          <PageActions>
            {canCreate && (
              <Button 
                variant="primary" 
                onClick={handleOpenCreateModal}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                New Course
              </Button>
            )}
          </PageActions>
        }
      />

      <div className="mb-6 flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <BookOpen size={18} className="text-slate-400" />
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses by code or title..."
            className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-2xl bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 focus:bg-white transition-all duration-300 hover:border-slate-300/80 text-slate-700 placeholder-slate-400"
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50/80 text-red-700 border border-red-200/50 shadow-soft backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-red-500"></div>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Course Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-glow max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-100 to-teal-100 rounded-xl">
                    <BookOpen size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Create New Course</h2>
                    <p className="text-sm text-slate-600">Add a new course to the curriculum</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseCreateModal}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Course Code and Title */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Course Code *
                    </label>
                    <Input
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value })}
                      placeholder="e.g., ANAT101"
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Course Name *
                    </label>
                    <Input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g., Human Anatomy"
                      required
                      className="h-11"
                    />
                  </div>
                </div>

                {/* Credit Hours and Instructor */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Credit Hours *
                    </label>
                    <Input
                      type="number"
                      min={0}
                      max={10}
                      value={form.credits}
                      onChange={(e) => setForm({ ...form, credits: Number(e.target.value) })}
                      placeholder="e.g., 4"
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Course Instructor *
                    </label>
                    <Input
                      value={courseInstructor}
                      onChange={(e) => setCourseInstructor(e.target.value)}
                      placeholder="e.g., Dr. Sarah Johnson"
                      required
                      className="h-11"
                    />
                  </div>
                </div>

                {/* Semester and Capacity */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Semester *
                    </label>
                    <select
                      className="w-full h-11 border-2 border-slate-200 rounded-xl px-3 focus:border-blue-400 focus:outline-none transition-colors"
                      value={form.semester}
                      onChange={(e) => setForm({ ...form, semester: e.target.value })}
                    >
                      {SEMESTERS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Student Capacity *
                    </label>
                    <Input
                      type="number"
                      min={1}
                      value={form.capacity}
                      onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                      placeholder="e.g., 50"
                      required
                      className="h-11"
                    />
                  </div>
                </div>

                {/* Course Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Course Description *
                  </label>
                  <textarea
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    placeholder="Provide a detailed description of the course content, objectives, and learning outcomes..."
                    required
                    rows={4}
                    className="w-full border-2 border-slate-200 rounded-xl px-3 py-3 focus:border-blue-400 focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseCreateModal}
                    className="px-6"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="px-6"
                  >
                    Create Course
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-teal-100 rounded-2xl mb-4">
            <BookOpen size={32} className="text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No Courses Available</h3>
          <p className="text-slate-600 mb-6">Get started by creating your first course</p>
          {canCreate && (
            <Button 
              variant="primary" 
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Create First Course
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses
            .filter(c => !query || (c.title?.toLowerCase().includes(query.toLowerCase()) || c.code?.toLowerCase().includes(query.toLowerCase())))
            .map((c) => (
            <Card key={c.id} className="hover:shadow-glow transition-all duration-300 interactive">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight mb-2">
                      {c.code} — {c.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="default" className="text-xs bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 border-blue-200">
                        {c.semester}
                      </Badge>
                      <Badge variant="secondary" className="text-xs bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border-slate-200">
                        {c.credits} Credits
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Users size={14} />
                  <span>Capacity: {c.capacity} students</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <UserIcon size={14} />
                  <span>Instructor: {c.instructor || 'TBD'}</span>
                </div>
                {c.description && (
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <FileText size={14} className="mt-0.5 flex-shrink-0" />
                    <p className="line-clamp-2">{c.description}</p>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Created by: {String(c.ownerId || "").slice(0, 8)}…</span>
                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


