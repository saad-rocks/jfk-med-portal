import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
// Storage upload removed; accept URLs instead
import { useRole } from "../hooks/useRole";
import { createAssignment, listAssignments } from "../lib/assignments";
import { useToast } from "../components/ui/toast";
import { PageHeader } from "../components/layout/PageHeader";
import { PageActions } from "../components/layout/PageActions";
import { Button } from "../components/ui/button";
const TYPES = ["hw", "quiz", "midterm", "final", "osce"];
export default function AssignmentsTeacher() {
    const { push } = useToast();
    const { courseId } = useParams();
    const { role } = useRole();
    const canManage = useMemo(() => role === "teacher" || role === "admin", [role]);
    const [form, setForm] = useState({
        title: "",
        type: "hw",
        dueAt: "",
        weight: 0,
        maxPoints: 100,
        instructions: "",
        attachments: [],
    });
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [items, setItems] = useState([]);
    useEffect(() => {
        (async () => {
            if (!courseId)
                return;
            const list = await listAssignments(courseId);
            setItems(list);
        })();
    }, [courseId]);
    function addAttachmentUrl(url) {
        if (!url)
            return;
        setForm((prev) => ({ ...prev, attachments: [...(prev.attachments || []), url] }));
    }
    async function handleSubmit(e) {
        e.preventDefault();
        if (!canManage || !courseId)
            return;
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
            });
            const list = await listAssignments(courseId);
            setItems(list);
            setForm({ title: "", type: "hw", dueAt: "", weight: 0, maxPoints: 100, instructions: "", attachments: [] });
            push({ variant: 'success', title: 'Assignment created', description: form.title });
        }
        catch (e) {
            setError(e?.message ?? "Failed to create assignment");
            push({ variant: 'error', title: 'Failed to create assignment', description: e?.message });
        }
    }
    if (!canManage)
        return _jsx("div", { className: "p-6", children: "Not authorized." });
    return (_jsxs("div", { className: "p-6 max-w-5xl mx-auto", children: [_jsx(PageHeader, { title: "Assignments (Teacher)", breadcrumb: [{ label: 'Home', to: '/' }, { label: 'Courses', to: '/courses' }, { label: String(courseId) }, { label: 'Assignments (Teacher)' }], actions: _jsx(PageActions, { children: _jsx(Button, { variant: "outline", onClick: () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), children: "New Assignment" }) }) }), error && _jsx("div", { className: "mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200", children: error }), _jsxs("form", { onSubmit: handleSubmit, className: "mb-6 grid gap-3 bg-white p-4 rounded border", children: [_jsxs("div", { className: "grid md:grid-cols-2 gap-3", children: [_jsxs("label", { className: "flex flex-col text-sm", children: [_jsx("span", { className: "mb-1 font-medium", children: "Title" }), _jsx("input", { className: "border rounded px-3 py-2", value: form.title, onChange: (e) => setForm({ ...form, title: e.target.value }), required: true })] }), _jsxs("label", { className: "flex flex-col text-sm", children: [_jsx("span", { className: "mb-1 font-medium", children: "Type" }), _jsx("select", { className: "border rounded px-3 py-2", value: form.type, onChange: (e) => setForm({ ...form, type: e.target.value }), children: TYPES.map(t => _jsx("option", { value: t, children: t }, t)) })] })] }), _jsxs("div", { className: "grid md:grid-cols-3 gap-3", children: [_jsxs("label", { className: "flex flex-col text-sm", children: [_jsx("span", { className: "mb-1 font-medium", children: "Due" }), _jsx("input", { type: "datetime-local", className: "border rounded px-3 py-2", value: form.dueAt, onChange: (e) => setForm({ ...form, dueAt: e.target.value }) })] }), _jsxs("label", { className: "flex flex-col text-sm", children: [_jsx("span", { className: "mb-1 font-medium", children: "Weight" }), _jsx("input", { type: "number", className: "border rounded px-3 py-2", value: form.weight, onChange: (e) => setForm({ ...form, weight: Number(e.target.value) }) })] }), _jsxs("label", { className: "flex flex-col text-sm", children: [_jsx("span", { className: "mb-1 font-medium", children: "Max Points" }), _jsx("input", { type: "number", className: "border rounded px-3 py-2", value: form.maxPoints, onChange: (e) => setForm({ ...form, maxPoints: Number(e.target.value) }) })] })] }), _jsxs("label", { className: "flex flex-col text-sm", children: [_jsx("span", { className: "mb-1 font-medium", children: "Instructions" }), _jsx("textarea", { className: "border rounded px-3 py-2", rows: 4, value: form.instructions, onChange: (e) => setForm({ ...form, instructions: e.target.value }) })] }), _jsxs("label", { className: "flex flex-col text-sm", children: [_jsx("span", { className: "mb-1 font-medium", children: "Attachment URLs" }), _jsx(AttachmentUrlAdder, { onAdd: addAttachmentUrl }), form.attachments?.length ? (_jsx("ul", { className: "mt-2 text-xs list-disc pl-4", children: form.attachments.map((u, i) => _jsx("li", { children: _jsxs("a", { href: u, className: "text-blue-600 underline", target: "_blank", rel: "noreferrer", children: ["Attachment ", i + 1] }) }, i)) })) : null] }), _jsx("div", { children: _jsx("button", { type: "submit", className: "px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700", children: "Create" }) })] }), _jsxs("div", { className: "bg-white border rounded p-4", children: [_jsx("h2", { className: "font-medium mb-3", children: "Assignments" }), _jsx("div", { className: "overflow-auto", children: _jsxs("table", { className: "min-w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "text-left border-b", children: [_jsx("th", { className: "py-2 pr-4", children: "Title" }), _jsx("th", { className: "py-2 pr-4", children: "Type" }), _jsx("th", { className: "py-2 pr-4", children: "Due" }), _jsx("th", { className: "py-2 pr-4", children: "Actions" })] }) }), _jsx("tbody", { children: items.map(a => (_jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "py-2 pr-4", children: a.title }), _jsx("td", { className: "py-2 pr-4", children: a.type }), _jsx("td", { className: "py-2 pr-4", children: a.dueAt ? new Date(a.dueAt).toLocaleString() : "" }), _jsx("td", { className: "py-2 pr-4 space-x-2", children: _jsx(Link, { className: "text-blue-600 underline", to: `/assignments/${a.id}/grade`, children: "View Submissions" }) })] }, a.id))) })] }) })] })] }));
}
function AttachmentUrlAdder({ onAdd }) {
    const [val, setVal] = useState("");
    return (_jsxs("div", { className: "flex gap-2", children: [_jsx("input", { value: val, onChange: (e) => setVal(e.target.value), placeholder: "https://...", className: "border rounded px-3 py-2 flex-1" }), _jsx("button", { type: "button", className: "px-3 py-2 rounded bg-gray-100 border", onClick: () => { onAdd(val.trim()); setVal(""); }, children: "Add" })] }));
}
