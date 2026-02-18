"use client";

import { toast } from "sonner";

type ToastAction = {
  label: string;
  onClick: () => void;
};

type AppToastOptions = {
  description?: string;
  action?: ToastAction;
};

export function useToast() {
  return {
    toast,
    success: (title: string, options?: AppToastOptions) =>
      toast.success(title, options),
    error: (title: string, options?: AppToastOptions) =>
      toast.error(title, options),
    info: (title: string, options?: AppToastOptions) => toast(title, options),
  };
}


