"use client";
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
      <div 
        className="fixed top-4 right-4 z-50 flex flex-col gap-2 items-end max-w-md w-full px-4 sm:px-0 pointer-events-none"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-6 py-3 rounded-lg shadow-2xl text-white animate-slide-in-down transition-all duration-300 flex items-center gap-3 min-w-[280px] max-w-full ${
              toast.type === "success" ? "bg-blue-600" : "bg-red-600"
            }`}
            role="alert"
            aria-live="assertive"
          >
            <div className="flex-shrink-0">
              {toast.type === "success" ? (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                </svg>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              )}
            </div>
            <span className="text-sm font-medium flex-1">{toast.message}</span>
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
