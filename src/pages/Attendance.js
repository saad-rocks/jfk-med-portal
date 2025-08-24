import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PageHeader } from "../components/layout/PageHeader";
export default function Attendance() {
    return (_jsxs("div", { className: "space-y-4", children: [_jsx(PageHeader, { title: "Attendance", breadcrumb: [{ label: 'Home', to: '/' }, { label: 'Attendance' }] }), _jsx("div", { className: "bg-white rounded-2xl border p-4", children: "Session list and take/mark UI (placeholder)." })] }));
}
