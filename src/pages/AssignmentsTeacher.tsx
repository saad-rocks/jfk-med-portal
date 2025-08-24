import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
// Storage upload removed; accept URLs instead
import { useRole } from "../hooks/useRole";
import { createAssignment, listAssignments } from "../lib/assignments";
import type { AssignmentType } from "../types";
import { useToast } from "../components/ui/toast";
import { PageHeader } from "../components/layout/PageHeader";
import { PageActions } from "../components/layout/PageActions";
import { Button } from "../components/ui/button";

const TYPES: AssignmentType[] = ["hw", "quiz", "midterm", "final", "osce"];

export default function AssignmentsTeacher() {
  const { push } = useToast();
  const { courseId } = useParams();
  const { role } = useRole();
  const canManage = useMemo(() => role === "teacher" || role === "admin", [role]);

  const [form, setForm] = useState({
    title: "",
    type: "hw" as AssignmentType,
    dueAt: "",
    weight: 0,
    maxPoints: 100,
    instructions: "",
    attachments: [] as string[],
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Array<any>>([]);

  useEffect(() => {
    (async () => {
      if (!courseId) return;
      const list = await listAssignments(courseId);
      setItems(list);
    })();
  }, [courseId]);

  function addAttachmentUrl(url: string) {
    if (!url) return;
    setForm((prev) => ({ ...prev, attachments: [...(prev.attachments || []), url] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canManage || !courseId) return;
    setError(null);
    try {
      const dueAtMs = form.dueAt ? new Date(form.dueAt).getTime() : Date.now();
      await createAssignment({
        courseId,
        title: form.title,
        type: form.type,
        dueAt: dueAtMs,
        weight: Number(form.weight),
        maxPoints: Number(form.maxPoints),
        instructions: form.instructions,
        attachments: form.attachments,
      } as any);
      const list = await listAssignments(courseId);
      setItems(list);
      setForm({ title: "", type: "hw", dueAt: "", weight: 0, maxPoints: 100, instructions: "", attachments: [] });
      push({ variant: 'success', title: 'Assignment created', description: form.title });
    } catch (e: any) {
      setError(e?.message ?? "Failed to create assignment");
      push({ variant: 'error', title: 'Failed to create assignment', description: e?.message });
    }
  }

  if (!canManage) return <div className="p-6">Not authorized.</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader
        title="Assignments (Teacher)"
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Courses', to: '/courses' }, { label: String(courseId) }, { label: 'Assignments (Teacher)' }]}
        actions={
          <PageActions>
            <Button variant="outline" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>New Assignment</Button>
          </PageActions>
        }
      />

      {error && <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">{error}</div>}

      <form onSubmit={handleSubmit} className="mb-6 grid gap-3 bg-white p-4 rounded border">
        <div className="grid md:grid-cols-2 gap-3">
          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Title</span>
            <input className="border rounded px-3 py-2" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </label>
          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Type</span>
            <select className="border rounded px-3 py-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as AssignmentType })}>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Due</span>
            <input type="datetime-local" className="border rounded px-3 py-2" value={form.dueAt} onChange={(e) => setForm({ ...form, dueAt: e.target.value })} />
          </label>
          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Weight</span>
            <input type="number" className="border rounded px-3 py-2" value={form.weight} onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })} />
          </label>
          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Max Points</span>
            <input type="number" className="border rounded px-3 py-2" value={form.maxPoints} onChange={(e) => setForm({ ...form, maxPoints: Number(e.target.value) })} />
          </label>
        </div>
        <label className="flex flex-col text-sm">
          <span className="mb-1 font-medium">Instructions</span>
          <textarea className="border rounded px-3 py-2" rows={4} value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} />
        </label>
        <label className="flex flex-col text-sm">
          <span className="mb-1 font-medium">Attachment URLs</span>
          <AttachmentUrlAdder onAdd={addAttachmentUrl} />
          {form.attachments?.length ? (
            <ul className="mt-2 text-xs list-disc pl-4">
              {form.attachments.map((u, i) => <li key={i}><a href={u} className="text-blue-600 underline" target="_blank" rel="noreferrer">Attachment {i+1}</a></li>)}
            </ul>
          ) : null}
        </label>
        <div>
          <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Create</button>
        </div>
      </form>

      <div className="bg-white border rounded p-4">
        <h2 className="font-medium mb-3">Assignments</h2>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-4">Title</th>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Due</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(a => (
                <tr key={a.id} className="border-b">
                  <td className="py-2 pr-4">{a.title}</td>
                  <td className="py-2 pr-4">{a.type}</td>
                  <td className="py-2 pr-4">{a.dueAt ? new Date(a.dueAt).toLocaleString() : ""}</td>
                  <td className="py-2 pr-4 space-x-2">
                    <Link className="text-blue-600 underline" to={`/assignments/${a.id}/grade`}>View Submissions</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AttachmentUrlAdder({ onAdd }: { onAdd: (url: string) => void }) {
  const [val, setVal] = useState("");
  return (
    <div className="flex gap-2">
      <input value={val} onChange={(e) => setVal(e.target.value)} placeholder="https://..." className="border rounded px-3 py-2 flex-1" />
      <button type="button" className="px-3 py-2 rounded bg-gray-100 border" onClick={() => { onAdd(val.trim()); setVal(""); }}>Add</button>
    </div>
  );
}


