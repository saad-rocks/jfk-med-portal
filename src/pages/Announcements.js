import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PageHeader } from "../components/layout/PageHeader";
import { PageActions } from "../components/layout/PageActions";
import { Button } from "../components/ui/button";
export default function Announcements() {
    return (_jsxs("div", { className: "space-y-4", children: [_jsx(PageHeader, { title: "Announcements", breadcrumb: [{ label: 'Home', to: '/' }, { label: 'Announcements' }], actions: _jsx(PageActions, { children: _jsx(Button, { variant: "primary", onClick: () => alert('Open editor (placeholder)'), children: "New Announcement" }) }) }), _jsx("div", { className: "bg-white rounded-2xl border p-4", children: "List and create editor (placeholder)." })] }));
}
