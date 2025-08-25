import { useParams } from "react-router-dom";

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Course Details</h1>
      <p>Course ID: {courseId}</p>
      <p>This page will show detailed information about the selected course.</p>
    </div>
  );
}


