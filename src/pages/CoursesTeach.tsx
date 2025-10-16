import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { listCourses } from "../lib/courses";
import { getAllUsers, type UserProfile } from "../lib/users";
import { createTeacherAssignment, getTeacherAssignments, removeTeacherAssignment, isCourseAvailableForAssignment, getCourseTeacherAssignments } from "../lib/teacherAssignments";
import { useRole } from "../hooks/useRole";
import { useToast } from "../hooks/useToast";

export default function CoursesTeach() {
  const navigate = useNavigate();
  const { role, user } = useRole();
  const { push } = useToast();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Array<{ id: string; code: string; title: string; semester: string }>>([]);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [assignedMap, setAssignedMap] = useState<Record<string, string>>({}); // courseId -> assignmentId
  const [unavailableCourses, setUnavailableCourses] = useState<Set<string>>(new Set()); // courseIds already assigned to other teachers
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!(role === 'teacher' || role === 'admin')) { setLoading(false); return; }
      setLoading(true);
      try {
        const list = await listCourses();
        setCourses(list.map((c) => ({ id: c.id, code: c.code, title: c.title, semester: c.semester })));

        // Resolve teacherId via users collection
        if (user?.email) {
          const all = await getAllUsers();
          const me = all.find(u => u.email?.toLowerCase() === user.email?.toLowerCase());
          if (me?.id) {
            setTeacherId(me.id);
            const mine = await getTeacherAssignments(me.id);
            const mapping: Record<string, string> = {};
            mine.forEach(a => { if (a.courseId) mapping[a.courseId] = a.id!; });
            setAssignedMap(mapping);

            // Check which courses are unavailable (assigned to other teachers)
            const unavailable = new Set<string>();
            await Promise.all(
              list.map(async (course) => {
                // Skip courses already assigned to current teacher
                if (mapping[course.id]) return;

                const assignments = await getCourseTeacherAssignments(course.id);
                if (assignments.length > 0) {
                  unavailable.add(course.id);
                }
              })
            );
            setUnavailableCourses(unavailable);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [role, user?.email]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter(c => c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
  }, [courses, query]);

  const toggleAssign = async (c: { id: string; code: string; title: string; semester: string }) => {
    if (!teacherId || !user?.email) return;
    setBusy(c.id);
    try {
      if (assignedMap[c.id]) {
        await removeTeacherAssignment(assignedMap[c.id]);
        const m = { ...assignedMap }; delete m[c.id]; setAssignedMap(m);
        // Remove from unavailable set since it's now available
        setUnavailableCourses(prev => {
          const next = new Set(prev);
          next.delete(c.id);
          return next;
        });
        push({ variant: 'success', title: 'Unassigned', description: `You have been removed from ${c.code}` });
      } else {
        const available = await isCourseAvailableForAssignment(c.id);
        if (!available) {
          push({
            variant: 'error',
            title: 'Course unavailable',
            description: 'This course is already assigned to another instructor'
          });
          // Add to unavailable set
          setUnavailableCourses(prev => new Set(prev).add(c.id));
          return;
        }
        const id = await createTeacherAssignment({
          teacherId,
          teacherEmail: user.email!,
          courseId: c.id,
          courseCode: c.code,
          courseTitle: c.title,
          semester: c.semester,
        });
        setAssignedMap(prev => ({ ...prev, [c.id]: id }));
        push({ variant: 'success', title: 'Assigned', description: `You are now teaching ${c.code}` });
      }
    } finally {
      setBusy(null);
    }
  };

  if (!(role === 'teacher' || role === 'admin')) {
    return (
      <div className="space-y-6">
        <PageHeader title="Select Courses to Teach" breadcrumb={[{ label: 'Courses', to: '/courses' }, { label: 'Select to Teach' }]} />
        <Card><CardContent className="p-6">You do not have permission to access this page.</CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Select Courses to Teach" breadcrumb={[{ label: 'Courses', to: '/courses' }, { label: 'Select to Teach' }]} />
      <Card>
        <CardContent className="p-6 space-y-4">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search courses..." className="w-full h-11 border-2 border-slate-200 rounded-xl px-3" />
          {loading ? (
            <div className="h-40 rounded-xl bg-slate-100 animate-pulse" />
          ) : (
            <div className="space-y-2">
              {filtered.map(c => {
                const isAssignedToMe = !!assignedMap[c.id];
                const isAssignedToOther = unavailableCourses.has(c.id);
                const isBusy = busy === c.id;

                return (
                  <div key={c.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white">
                    <div>
                      <div className="font-semibold text-slate-800">{c.code} — {c.title}</div>
                      <div className="text-sm text-slate-500">{c.semester}</div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => toggleAssign(c)}
                      disabled={isBusy || isAssignedToOther}
                      variant={isAssignedToOther ? "outline" : undefined}
                      className={isAssignedToOther ? "text-slate-400 border-slate-300 cursor-not-allowed" : ""}
                    >
                      {isBusy ? 'Saving...' : isAssignedToMe ? 'Unassign' : isAssignedToOther ? 'Already Assigned' : 'Assign to Me'}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
          <div className="pt-2"><Button variant="outline" onClick={() => navigate('/courses')}>Back to Courses</Button></div>
        </CardContent>
      </Card>
    </div>
  );
}

