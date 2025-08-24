import { Link, useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Tabs } from "../components/ui/tabs";
import { PageHeader } from "../components/layout/PageHeader";

export default function CourseDetail() {
  const { courseId } = useParams();
  return (
    <div className="space-y-6">
      <PageHeader
        title={`Course: ${courseId}`}
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Courses', to: '/courses' }, { label: String(courseId) }]}
        actions={
          <div className="flex gap-2 text-sm">
            <Link className="text-blue-700 underline" to={`/courses/${courseId}/assignments`}>Student View</Link>
            <Link className="text-blue-700 underline" to={`/courses/${courseId}/assignments/teacher`}>Teacher View</Link>
          </div>
        }
      />

      <Tabs
        tabs={[
          { key: 'overview', label: 'Overview', content: <div className="text-sm">Course intro, syllabus, faculty.</div> },
          { key: 'assignments', label: 'Assignments', content: <div className="text-sm">Manage and submit assignments.</div> },
          { key: 'materials', label: 'Materials', content: <div className="text-sm">Links and resources.</div> },
          { key: 'grades', label: 'Grades', content: <div className="text-sm">Grades placeholder.</div> },
          { key: 'attendance', label: 'Attendance', content: <div className="text-sm">Attendance placeholder.</div> },
        ]}
      />
    </div>
  );
}


