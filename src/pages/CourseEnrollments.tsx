import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { getCourseById, getEnrollmentsWithStudentDetails } from "../lib/enrollments";

export default function CourseEnrollments() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [courseTitle, setCourseTitle] = useState<string>("");
  const [rows, setRows] = useState<Array<{ id: string; studentName: string; studentEmail: string; studentMdYear: string }>>([]);

  useEffect(() => {
    const run = async () => {
      if (!courseId) return;
      setLoading(true);
      try {
        const c = await getCourseById(courseId);
        setCourseTitle(c ? `${(c as any).code} — ${(c as any).title}` : "");
        const list = await getEnrollmentsWithStudentDetails(courseId);
        setRows(list);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [courseId]);

  return (
    <div className="space-y-6">
      <PageHeader title="Course Enrollments" />
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-slate-700 font-medium">{courseTitle}</div>
            {courseId && (
              <Button variant="outline" onClick={() => navigate(`/courses/${courseId}/students`)}>Add Students</Button>
            )}
          </div>
          {loading ? (
            <div className="h-40 rounded-xl bg-slate-100 animate-pulse" />
          ) : rows.length === 0 ? (
            <div className="p-6 rounded-xl border border-slate-200 bg-white text-slate-600">No students enrolled yet.</div>
          ) : (
            <div className="space-y-2">
              {rows.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white">
                  <div>
                    <div className="font-semibold text-slate-800">{r.studentName}</div>
                    <div className="text-sm text-slate-500">{r.studentEmail} • {r.studentMdYear}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

