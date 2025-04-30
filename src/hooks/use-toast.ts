/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

export type ToastVariant =
  | "default"
  | "success"
  | "destructive"
  | "warning"
  | "info";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  onClose?: () => void;
}

interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  onClose?: () => void;
}

// Create a singleton pattern for toast state to share across hooks
let toasts: Toast[] = [];
let listeners: ((toasts: Toast[]) => void)[] = [];

const DEFAULT_TOAST_DURATION = 5000; // 5 seconds

function emitChange() {
  listeners.forEach((listener) => {
    listener(toasts);
  });
}

export function useToast(): {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  toasts: Toast[];
} {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>(toasts);

  useEffect(() => {
    listeners.push(setCurrentToasts);
    return () => {
      listeners = listeners.filter((listener) => listener !== setCurrentToasts);
    };
  }, []);

  const addToast = useCallback((options: ToastOptions) => {
    const id = uuidv4();
    const toast: Toast = {
      id,
      title: options.title,
      description: options.description,
      variant: options.variant || "default",
      duration: options.duration || DEFAULT_TOAST_DURATION,
      onClose: options.onClose,
    };

    toasts = [...toasts, toast];
    emitChange();

    // Auto dismiss
    if (toast.duration !== Number.POSITIVE_INFINITY) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    const toast = toasts.find((t) => t.id === id);
    toasts = toasts.filter((t) => t.id !== id);
    emitChange();

    // Call onClose callback if provided
    if (toast?.onClose) {
      toast.onClose();
    }
  }, []);

  return {
    toast: addToast,
    dismiss: removeToast,
    toasts: currentToasts,
  };
}
