import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

interface ToastContextProps {
  showToast: (message: string, type: "success" | "error") => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast deve ser usado dentro do ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: "success" | "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 items-end">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-2 rounded shadow-lg text-white animate-slide-in-down transition-all duration-300 ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}
            role="alert"
            aria-live="assertive"
          >
            {toast.message}
          </div>
        ))}
      </div>
      <style jsx global>{`
        @keyframes slide-in-down {
          0% { opacity: 0; transform: translateY(-30px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-slide-in-down {
          animation: slide-in-down 0.4s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </ToastContext.Provider>
  );
}
