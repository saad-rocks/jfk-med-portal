import { useCallback, useMemo, useState } from "react";
import { useToast, ToastContext } from "../../hooks/useToast";

type Toast = { id: number; title?: string; description?: string; variant?: "default" | "success" | "error" };

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, ...t }]);
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 4000);
  }, []);
  const remove = useCallback((id: number) => setToasts(prev => prev.filter(t => t.id !== id)), []);
  const value = useMemo(() => ({ toasts, push, remove }), [toasts, push, remove]);
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function ToastContainer() {
  const { toasts, remove } = useToast();
  return (
    <div className="fixed z-50 bottom-4 right-4 space-y-2">
      {toasts.map(t => (
        <div key={t.id} className={`min-w-[260px] max-w-sm rounded-xl border px-4 py-3 shadow-sm bg-white ${t.variant === 'success' ? 'border-green-200' : t.variant === 'error' ? 'border-red-200' : 'border-gray-200'}`}>
          {t.title && <div className="text-sm font-medium mb-0.5">{t.title}</div>}
          {t.description && <div className="text-xs text-gray-600">{t.description}</div>}
          <button onClick={() => remove(t.id)} className="text-xs text-gray-500 underline mt-1">Dismiss</button>
        </div>
      ))}
    </div>
  );
}


