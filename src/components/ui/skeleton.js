import { jsx as _jsx } from "react/jsx-runtime";
export function Skeleton({ className = "" }) {
    return _jsx("div", { className: `animate-pulse bg-gray-200 rounded ${className}` });
}
