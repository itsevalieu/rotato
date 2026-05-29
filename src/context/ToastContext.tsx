"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface Toast {
  id: string;
  message: string;
  icon?: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (message: string, icon?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, icon = "✨", duration = 2800) => {
    const id = String(++toastId);
    setToasts((prev) => [...prev, { id, message, icon, duration }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastList toasts={toasts} />
    </ToastContext.Provider>
  );
}

function ToastList({ toasts }: { toasts: Toast[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return createPortal(
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] flex flex-col items-center gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-warm
              bg-cream/95 dark:bg-[#2a1f18]/95 backdrop-blur-md
              border border-warm-gray-light/30 dark:border-white/[0.12]
              text-soft-brown dark:text-[#F0E4DA] text-sm font-medium"
          >
            {t.icon && <span className="text-base">{t.icon}</span>}
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
