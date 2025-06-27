import { useState } from "react";

import type { ToastState } from "@/types/common";

export const useToastNotifications = () => {
  const [toast, setToast] = useState<ToastState>({
    message: "",
    type: "success",
    show: false,
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type, show: true });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 5000);
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  return {
    toast,
    showToast,
    hideToast,
  };
};
