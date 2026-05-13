"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();

      // Focus trap
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    // Focus first focusable element
    requestAnimationFrame(() => {
      const first = dialogRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      first?.focus();
    });

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const modalContent = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pb-[env(safe-area-inset-bottom)] sm:pb-0 p-4 sm:p-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-soft-brown/30 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative z-10 w-full max-w-lg max-h-[85vh] overflow-y-auto
              bg-cream rounded-2xl shadow-warm-lg p-6
              border border-warm-gray-light/30"
          >
            {title && (
              <h2 className="text-xl font-accent text-soft-brown mb-4">
                {title}
              </h2>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(modalContent, document.body);
}
