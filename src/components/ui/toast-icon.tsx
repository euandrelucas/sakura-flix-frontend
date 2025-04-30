"use client";

import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

interface ToastIconProps {
  variant?: "default" | "success" | "destructive" | "warning" | "info";
  className?: string;
}

export function ToastIcon({ variant = "default", className }: ToastIconProps) {
  const iconClasses = "h-5 w-5";

  switch (variant) {
    case "success":
      return (
        <CheckCircle
          className={`${iconClasses} text-green-600 dark:text-green-400 ${className}`}
        />
      );
    case "destructive":
      return (
        <XCircle
          className={`${iconClasses} text-red-600 dark:text-red-400 ${className}`}
        />
      );
    case "warning":
      return (
        <AlertTriangle
          className={`${iconClasses} text-yellow-600 dark:text-yellow-400 ${className}`}
        />
      );
    case "info":
      return (
        <Info
          className={`${iconClasses} text-blue-600 dark:text-blue-400 ${className}`}
        />
      );
    default:
      return (
        <Info className={`${iconClasses} text-foreground/80 ${className}`} />
      );
  }
}
