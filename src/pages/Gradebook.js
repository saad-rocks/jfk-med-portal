import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PageHeader } from "../components/layout/PageHeader";
export default function Gradebook() {
    return (_jsxs("div", { className: "space-y-4", children: [_jsx(PageHeader, { title: "Gradebook", breadcrumb: [{ label: 'Home', to: '/' }, { label: 'Gradebook' }] }), _jsx("div", { className: "bg-white rounded-2xl border p-4", children: "Weighted categories and editable cells (placeholder)." })] }));
}
