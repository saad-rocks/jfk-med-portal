import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useRole } from "../hooks/useRole";
import { listAssignments } from "../lib/assignments";
import { saveSubmission, getSubmissionForStudent } from "../lib/submissions";
import { auth } from "../firebase";
import { useToast } from "../components/ui/toast";
import { PageHeader } from "../components/layout/PageHeader";

export default function AssignmentsStudent() {
  const { push } = useToast();
  const { courseId } = useParams();
  const { role } = useRole();
  const [assignments, setAssignments] = useState<Array<any>>([]);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [mySubs, setMySubs] = useState<Record<string, any>>({});
  const canSubmit = useMemo(() => role === "student", [role]);

  useEffect(() => {
    (async () => {
      if (!courseId) return;
      const list = await listAssignments(courseId);
      list.sort((a, b) => (a.dueAt ?? 0) - (b.dueAt ?? 0));
      setAssignments(list);
      const u = auth.currentUser;
      if (u) {
        const entries = await Promise.all(list.map(a => getSubmissionForStudent(a.id, u.uid)));
        const map: Record<string, any> = {};
        entries.forEach((sub, idx) => { if (sub) map[list[idx].id] = sub; });
        setMySubs(map);
      }
    })();
  }, [courseId]);

  async function handleSubmitLink(assignmentId: string, url: string) {
    if (!url || !courseId) return;
    const user = auth.currentUser; if (!user) return;
    setSavingId(assignmentId);
    try {
      await saveSubmission({ assignmentId, courseId, studentId: user.uid, fileUrl: url, grade: { points: null, percent: null, feedback: null, gradedAt: null, graderId: null } });
      const sub = await getSubmissionForStudent(assignmentId, user.uid);
      setMySubs(prev => ({ ...prev, [assignmentId]: sub }));
      push({ variant: 'success', title: 'Submission saved', description: 'Your link has been recorded.' });
    } catch (e: any) {
      push({ variant: 'error', title: 'Failed to submit', description: e?.message });
    } finally { setSavingId(null); }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Assignments" breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Courses', to: '/courses' }, { label: String(courseId) }, { label: 'Assignments' }]} />
      <div className="grid gap-4">
        {assignments.map(a => (
          <div key={a.id} className="border rounded-lg p-4 bg-white">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-semibold">{a.title}</div>
                <div className="text-sm text-gray-600">Due: {a.dueAt ? new Date(a.dueAt).toLocaleString() : "—"}</div>
                {a.instructions && <div className="text-sm mt-2 whitespace-pre-wrap">{a.instructions}</div>}
                {a.attachments?.length ? (
                  <ul className="mt-2 text-sm list-disc pl-5">
                    {a.attachments.map((u: string, i: number) => <li key={i}><a className="text-blue-600 underline" href={u} target="_blank" rel="noreferrer">Attachment {i+1}</a></li>)}
                  </ul>
                ) : null}
              </div>
              <div className="text-sm w-64">
                {mySubs[a.id] ? (
                  <div className="mb-2">
                    <div className="text-xs text-gray-600">Submitted: {mySubs[a.id].submittedAt ? new Date(mySubs[a.id].submittedAt).toLocaleString() : "—"}</div>
                    <a className="text-blue-600 underline break-all" href={mySubs[a.id].fileUrl} target="_blank" rel="noreferrer">View link</a>
                  </div>
                ) : null}
                {canSubmit && (
                  <form onSubmit={(e) => { e.preventDefault(); const url = (e.currentTarget.elements.namedItem('url') as HTMLInputElement).value; handleSubmitLink(a.id, url); }}>
                    <label className="block mb-1 font-medium">Submit link</label>
                    <input name="url" type="url" placeholder="https://..." className="border rounded px-2 py-1 w-full mb-2" />
                    <button disabled={savingId === a.id} className="px-3 py-1 rounded bg-blue-600 text-white w-full">{savingId === a.id ? 'Saving…' : 'Submit'}</button>
                  </form>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


