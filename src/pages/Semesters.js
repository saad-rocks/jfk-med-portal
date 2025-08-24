import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PageHeader } from "../components/layout/PageHeader";
export default function Semesters() {
    return (_jsxs("div", { className: "space-y-4", children: [_jsx(PageHeader, { title: "Semesters", breadcrumb: [{ label: 'Home', to: '/' }, { label: 'Semesters' }] }), _jsx("div", { className: "bg-white rounded-2xl border p-4", children: "Overview, timeline, enrollment summary (placeholder)." })] }));
}
