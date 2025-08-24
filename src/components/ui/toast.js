import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
const ToastContext = createContext(null);
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const push = useCallback((t) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, ...t }]);
        setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 4000);
    }, []);
    const remove = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);
    const value = useMemo(() => ({ toasts, push, remove }), [toasts, push, remove]);
    return _jsx(ToastContext.Provider, { value: value, children: children });
}
export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx)
        throw new Error("useToast must be used within ToastProvider");
    return ctx;
}
export function ToastContainer() {
    const { toasts, remove } = useToast();
    return (_jsx("div", { className: "fixed z-50 bottom-4 right-4 space-y-2", children: toasts.map(t => (_jsxs("div", { className: `min-w-[260px] max-w-sm rounded-xl border px-4 py-3 shadow-sm bg-white ${t.variant === 'success' ? 'border-green-200' : t.variant === 'error' ? 'border-red-200' : 'border-gray-200'}`, children: [t.title && _jsx("div", { className: "text-sm font-medium mb-0.5", children: t.title }), t.description && _jsx("div", { className: "text-xs text-gray-600", children: t.description }), _jsx("button", { onClick: () => remove(t.id), className: "text-xs text-gray-500 underline mt-1", children: "Dismiss" })] }, t.id))) }));
}
