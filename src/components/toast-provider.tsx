"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
} from "@/components/ui/toast";
import { ToastIcon } from "@/components/ui/toast-icon";

export function ToastProvider() {
  const { toasts, dismiss } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) return null;

  return createPortal(
    <div className="fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            <Toast variant={toast.variant}>
              <div className="flex items-start gap-3">
                <ToastIcon variant={toast.variant} />
                <div className="flex-1">
                  <ToastTitle>{toast.title}</ToastTitle>
                  {toast.description && (
                    <ToastDescription>{toast.description}</ToastDescription>
                  )}
                </div>
              </div>
              <ToastClose onClick={() => dismiss(toast.id)} />
            </Toast>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}
