import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { useBreadcrumbs } from "./useBreadcrumbs";
export function PageHeader({ title, actions, breadcrumb }) {
    const auto = useBreadcrumbs();
    const resolvedBreadcrumb = breadcrumb ?? auto;
    return (_jsxs("div", { className: "mb-4", children: [resolvedBreadcrumb && (_jsx("nav", { className: "text-xs text-gray-500 mb-1", children: resolvedBreadcrumb.map((b, i) => (_jsxs("span", { children: [b.to ? _jsx(Link, { className: "hover:underline", to: b.to, children: b.label }) : _jsx("span", { children: b.label }), i < resolvedBreadcrumb.length - 1 && _jsx("span", { className: "mx-1", children: "/" })] }, i))) })), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-2xl font-semibold text-blue-700", children: title }), actions] })] }));
}
