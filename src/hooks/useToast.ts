import { useContext } from "react";
import { createContext } from "react";

type Toast = { id: number; title?: string; description?: string; variant?: "default" | "success" | "error" };

const ToastContext = createContext<{
  toasts: Toast[];
  push: (t: Omit<Toast, "id">) => void;
  remove: (id: number) => void;
} | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

// Export the context so it can be used in the toast component
export { ToastContext };
