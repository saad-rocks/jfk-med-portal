import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PageHeader } from "../components/layout/PageHeader";
export default function UsersAdmin() {
    return (_jsxs("div", { className: "space-y-4", children: [_jsx(PageHeader, { title: "Users", breadcrumb: [{ label: 'Home', to: '/' }, { label: 'Users' }] }), _jsx("div", { className: "bg-white rounded-2xl border p-4", children: "List, create/edit modal, role badges (placeholder)." })] }));
}
