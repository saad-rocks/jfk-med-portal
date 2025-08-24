import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    const [assignments, setAssignments] = useState([]);
    const [savingId, setSavingId] = useState(null);
    const [mySubs, setMySubs] = useState({});
    const canSubmit = useMemo(() => role === "student", [role]);
    useEffect(() => {
        (async () => {
            if (!courseId)
                return;
            const list = await listAssignments(courseId);
            list.sort((a, b) => (a.dueAt ?? 0) - (b.dueAt ?? 0));
            setAssignments(list);
            const u = auth.currentUser;
            if (u) {
                const entries = await Promise.all(list.map(a => getSubmissionForStudent(a.id, u.uid)));
                const map = {};
                entries.forEach((sub, idx) => { if (sub)
                    map[list[idx].id] = sub; });
                setMySubs(map);
            }
        })();
    }, [courseId]);
    async function handleSubmitLink(assignmentId, url) {
        if (!url || !courseId)
            return;
        const user = auth.currentUser;
        if (!user)
            return;
        setSavingId(assignmentId);
        try {
            await saveSubmission({ assignmentId, courseId, studentId: user.uid, fileUrl: url, grade: { points: null, percent: null, feedback: null, gradedAt: null, graderId: null } });
            const sub = await getSubmissionForStudent(assignmentId, user.uid);
            setMySubs(prev => ({ ...prev, [assignmentId]: sub }));
            push({ variant: 'success', title: 'Submission saved', description: 'Your link has been recorded.' });
        }
        catch (e) {
            push({ variant: 'error', title: 'Failed to submit', description: e?.message });
        }
        finally {
            setSavingId(null);
        }
    }
    return (_jsxs("div", { className: "p-6 max-w-4xl mx-auto", children: [_jsx(PageHeader, { title: "Assignments", breadcrumb: [{ label: 'Home', to: '/' }, { label: 'Courses', to: '/courses' }, { label: String(courseId) }, { label: 'Assignments' }] }), _jsx("div", { className: "grid gap-4", children: assignments.map(a => (_jsx("div", { className: "border rounded-lg p-4 bg-white", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-lg font-semibold", children: a.title }), _jsxs("div", { className: "text-sm text-gray-600", children: ["Due: ", a.dueAt ? new Date(a.dueAt).toLocaleString() : "—"] }), a.instructions && _jsx("div", { className: "text-sm mt-2 whitespace-pre-wrap", children: a.instructions }), a.attachments?.length ? (_jsx("ul", { className: "mt-2 text-sm list-disc pl-5", children: a.attachments.map((u, i) => _jsx("li", { children: _jsxs("a", { className: "text-blue-600 underline", href: u, target: "_blank", rel: "noreferrer", children: ["Attachment ", i + 1] }) }, i)) })) : null] }), _jsxs("div", { className: "text-sm w-64", children: [mySubs[a.id] ? (_jsxs("div", { className: "mb-2", children: [_jsxs("div", { className: "text-xs text-gray-600", children: ["Submitted: ", mySubs[a.id].submittedAt ? new Date(mySubs[a.id].submittedAt).toLocaleString() : "—"] }), _jsx("a", { className: "text-blue-600 underline break-all", href: mySubs[a.id].fileUrl, target: "_blank", rel: "noreferrer", children: "View link" })] })) : null, canSubmit && (_jsxs("form", { onSubmit: (e) => { e.preventDefault(); const url = e.currentTarget.elements.namedItem('url').value; handleSubmitLink(a.id, url); }, children: [_jsx("label", { className: "block mb-1 font-medium", children: "Submit link" }), _jsx("input", { name: "url", type: "url", placeholder: "https://...", className: "border rounded px-2 py-1 w-full mb-2" }), _jsx("button", { disabled: savingId === a.id, className: "px-3 py-1 rounded bg-blue-600 text-white w-full", children: savingId === a.id ? 'Saving…' : 'Submit' })] }))] })] }) }, a.id))) })] }));
}
