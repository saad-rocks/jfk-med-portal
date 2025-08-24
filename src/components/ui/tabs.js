import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
export function Tabs({ tabs }) {
    const [active, setActive] = useState(tabs[0]?.key);
    return (_jsxs("div", { children: [_jsx("div", { className: "flex gap-2 border-b", children: tabs.map(t => (_jsx("button", { onClick: () => setActive(t.key), className: `px-3 py-2 text-sm rounded-t-lg ${active === t.key ? 'bg-white border-x border-t' : 'hover:bg-gray-50'}`, children: t.label }, t.key))) }), _jsx("div", { className: "border rounded-b-lg p-4 bg-white", children: tabs.find(t => t.key === active)?.content })] }));
}
