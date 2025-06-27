import { useCallback, useState } from "react";

export interface ToastState {
  message: string;
  type: "success" | "error" | "info" | "warning";
  show: boolean;
}

interface UseToastOptions {
  autoHideDuration?: number;
  defaultType?: ToastState["type"];
}

export const useToast = (options: UseToastOptions = {}) => {
  const { autoHideDuration = 5000, defaultType = "info" } = options;

  const [toast, setToast] = useState<ToastState>({
    message: "",
    type: defaultType,
    show: false,
  });

  const showToast = useCallback(
    (message: string, type: ToastState["type"] = defaultType) => {
      setToast({ message, type, show: true });

      if (autoHideDuration > 0) {
        setTimeout(() => {
          setToast((prev) => ({ ...prev, show: false }));
        }, autoHideDuration);
      }
    },
    [defaultType, autoHideDuration],
  );

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  const showSuccess = useCallback(
    (message: string) => {
      showToast(message, "success");
    },
    [showToast],
  );

  const showError = useCallback(
    (message: string) => {
      showToast(message, "error");
    },
    [showToast],
  );

  const showInfo = useCallback(
    (message: string) => {
      showToast(message, "info");
    },
    [showToast],
  );

  const showWarning = useCallback(
    (message: string) => {
      showToast(message, "warning");
    },
    [showToast],
  );

  return {
    toast,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
};
