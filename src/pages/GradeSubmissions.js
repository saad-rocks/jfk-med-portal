import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    const [assignment, setAssignment] = useState(null);
    const [subs, setSubs] = useState([]);
    const [error, setError] = useState(null);
    useEffect(() => {
        (async () => {
            if (!assignmentId)
                return;
            try {
                const [a, s] = await Promise.all([
                    getAssignment(assignmentId),
                    listSubmissions(assignmentId),
                ]);
                setAssignment(a);
                setSubs(s);
            }
            catch (e) {
                setError(e?.message ?? "Failed to load");
            }
        })();
    }, [assignmentId]);
    async function handleSave(id, points, feedback) {
        if (!assignment)
            return;
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
        const updated = await listSubmissions(assignmentId);
        setSubs(updated);
        push({ variant: 'success', title: 'Saved grade' });
    }
    if (!canGrade)
        return _jsx("div", { className: "p-6", children: "Not authorized." });
    return (_jsxs("div", { className: "p-6 max-w-5xl mx-auto", children: [_jsx(PageHeader, { title: "Grade Submissions", breadcrumb: [{ label: 'Home', to: '/' }, { label: 'Assignments' }, { label: 'Grade' }] }), error && _jsx("div", { className: "mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200", children: error }), assignment && (_jsxs("div", { className: "mb-4 text-sm text-gray-700", children: ["Assignment: ", _jsx("span", { className: "font-medium", children: assignment.title }), " \u00B7 Max Points: ", assignment.maxPoints] })), _jsx("div", { className: "bg-white border rounded p-4 overflow-auto", children: _jsxs("table", { className: "min-w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "text-left border-b", children: [_jsx("th", { className: "py-2 pr-4", children: "Student" }), _jsx("th", { className: "py-2 pr-4", children: "Submitted" }), _jsx("th", { className: "py-2 pr-4", children: "File" }), _jsx("th", { className: "py-2 pr-4", children: "Points" }), _jsx("th", { className: "py-2 pr-4", children: "Feedback" }), _jsx("th", { className: "py-2 pr-4", children: "Save" })] }) }), _jsx("tbody", { children: subs.map(s => (_jsx(Row, { sub: s, onSave: handleSave }, s.id))) })] }) })] }));
}
function Row({ sub, onSave }) {
    const [points, setPoints] = useState(sub?.grade?.points ?? 0);
    const [feedback, setFeedback] = useState(sub?.grade?.feedback ?? "");
    return (_jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "py-2 pr-4 font-mono text-xs", children: sub.studentId }), _jsx("td", { className: "py-2 pr-4", children: sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : "—" }), _jsx("td", { className: "py-2 pr-4", children: _jsx("a", { className: "text-blue-600 underline", href: sub.fileUrl, target: "_blank", rel: "noreferrer", children: "Open" }) }), _jsx("td", { className: "py-2 pr-4", children: _jsx("input", { type: "number", className: "border rounded px-2 py-1 w-24", value: points, onChange: (e) => setPoints(Number(e.target.value)) }) }), _jsx("td", { className: "py-2 pr-4", children: _jsx("textarea", { className: "border rounded px-2 py-1", rows: 1, value: feedback, onChange: (e) => setFeedback(e.target.value) }) }), _jsx("td", { className: "py-2 pr-4", children: _jsx("button", { className: "px-3 py-1 rounded bg-blue-600 text-white", onClick: () => onSave(sub.id, points, feedback), children: "Save" }) })] }));
}
