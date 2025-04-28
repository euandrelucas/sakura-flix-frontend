"use client";

// This is a simplified version of the toast hook
// In a real implementation, you would use a proper toast library like react-hot-toast or sonner

import { useState } from "react";

type ToastVariant = "default" | "success" | "destructive" | "warning";

interface ToastProps {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  id?: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = (props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...props, id };

    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Auto-dismiss toast after duration
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, props.duration || 5000);

    return id;
  };

  const dismiss = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return { toast, dismiss, toasts };
}
