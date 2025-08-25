import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import type { Submission } from "../types";

export default function GradeSubmissions() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!assignmentId) return;

      try {
        const submissionsQuery = query(
          collection(db, "submissions"),
          where("assignmentId", "==", assignmentId)
        );
        const submissionsSnapshot = await getDocs(submissionsQuery);
        const submissionsData = submissionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Submission[];
        setSubmissions(submissionsData);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [assignmentId]);

  if (loading) {
    return <div className="p-6">Loading submissions...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Grade Submissions</h1>
      <div className="space-y-4">
        {submissions.map((submission) => (
          <div key={submission.id} className="border rounded-lg p-4">
            <h3 className="font-semibold">Student Submission</h3>
            <p className="text-sm text-gray-600">Submitted: {new Date(submission.submittedAt).toLocaleDateString()}</p>
            <p className="text-sm">File: <a href={submission.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">View Submission</a></p>
            
            {submission.grade.gradedAt ? (
              <div className="mt-2 p-2 bg-gray-50 rounded">
                <p className="text-sm">Points: {submission.grade.points}</p>
                <p className="text-sm">Feedback: {submission.grade.feedback}</p>
                <p className="text-sm">Graded: {new Date(submission.grade.gradedAt).toLocaleDateString()}</p>
              </div>
            ) : (
              <div className="mt-2 p-2 bg-yellow-50 rounded">
                <p className="text-sm text-yellow-700">Not graded yet</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


