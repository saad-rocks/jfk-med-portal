"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageHeader = PageHeader;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_router_dom_1 = require("react-router-dom");
var useBreadcrumbs_1 = require("./useBreadcrumbs");
function PageHeader(_a) {
    var title = _a.title, actions = _a.actions, breadcrumb = _a.breadcrumb;
    var auto = (0, useBreadcrumbs_1.useBreadcrumbs)();
    var resolvedBreadcrumb = breadcrumb !== null && breadcrumb !== void 0 ? breadcrumb : auto;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "mb-4", children: [resolvedBreadcrumb && ((0, jsx_runtime_1.jsx)("nav", { className: "text-xs text-gray-500 mb-1", children: resolvedBreadcrumb.map(function (b, i) { return ((0, jsx_runtime_1.jsxs)("span", { children: [b.to ? (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { className: "hover:underline", to: b.to, children: b.label }) : (0, jsx_runtime_1.jsx)("span", { children: b.label }), i < resolvedBreadcrumb.length - 1 && (0, jsx_runtime_1.jsx)("span", { className: "mx-1", children: "/" })] }, i)); }) })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-semibold text-blue-700", children: title }), actions] })] }));
}
