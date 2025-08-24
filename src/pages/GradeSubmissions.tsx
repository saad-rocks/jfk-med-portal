import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useRole } from "../hooks/useRole";
import { getAssignment } from "../lib/assignments";
import { listSubmissions } from "../lib/submissions";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useToast } from "../components/ui/toast";
import { PageHeader } from "../components/layout/PageHeader";

export default function GradeSubmissions() {
  const { push } = useToast();
  const { assignmentId } = useParams();
  const { role } = useRole();
  const canGrade = useMemo(() => role === "teacher" || role === "admin", [role]);
  const [assignment, setAssignment] = useState<any | null>(null);
  const [subs, setSubs] = useState<Array<any>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!assignmentId) return;
      try {
        const [a, s] = await Promise.all([
          getAssignment(assignmentId),
          listSubmissions(assignmentId),
        ]);
        setAssignment(a);
        setSubs(s);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load");
      }
    })();
  }, [assignmentId]);

  async function handleSave(id: string, points: number, feedback: string) {
    if (!assignment) return;
    const percent = Math.round((points / (assignment.maxPoints || 100)) * 10000) / 100;
    await updateDoc(doc(db, "submissions", id), {
      grade: {
        points,
        percent,
        feedback,
        gradedAt: Date.now(),
        graderId: auth.currentUser?.uid ?? null,
      },
    });
    const updated = await listSubmissions(assignmentId!);
    setSubs(updated);
    push({ variant: 'success', title: 'Saved grade' });
  }

  if (!canGrade) return <div className="p-6">Not authorized.</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader title="Grade Submissions" breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Assignments' }, { label: 'Grade' }]} />
      {error && <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">{error}</div>}
      {assignment && (
        <div className="mb-4 text-sm text-gray-700">Assignment: <span className="font-medium">{assignment.title}</span> · Max Points: {assignment.maxPoints}</div>
      )}
      <div className="bg-white border rounded p-4 overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-4">Student</th>
              <th className="py-2 pr-4">Submitted</th>
              <th className="py-2 pr-4">File</th>
              <th className="py-2 pr-4">Points</th>
              <th className="py-2 pr-4">Feedback</th>
              <th className="py-2 pr-4">Save</th>
            </tr>
          </thead>
          <tbody>
            {subs.map(s => (
              <Row key={s.id} sub={s} onSave={handleSave} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Row({ sub, onSave }: { sub: any; onSave: (id: string, points: number, feedback: string) => void }) {
  const [points, setPoints] = useState<number>(sub?.grade?.points ?? 0);
  const [feedback, setFeedback] = useState<string>(sub?.grade?.feedback ?? "");
  return (
    <tr className="border-b">
      <td className="py-2 pr-4 font-mono text-xs">{sub.studentId}</td>
      <td className="py-2 pr-4">{sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : "—"}</td>
      <td className="py-2 pr-4"><a className="text-blue-600 underline" href={sub.fileUrl} target="_blank" rel="noreferrer">Open</a></td>
      <td className="py-2 pr-4"><input type="number" className="border rounded px-2 py-1 w-24" value={points} onChange={(e) => setPoints(Number(e.target.value))} /></td>
      <td className="py-2 pr-4"><textarea className="border rounded px-2 py-1" rows={1} value={feedback} onChange={(e) => setFeedback(e.target.value)} /></td>
      <td className="py-2 pr-4"><button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={() => onSave(sub.id, points, feedback)}>Save</button></td>
    </tr>
  );
}


