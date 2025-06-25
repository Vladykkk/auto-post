import { useEffect, useState } from "react";
import { IoCheckmarkCircle, IoClose, IoCloseCircle } from "react-icons/io5";

interface ToastProps {
  message: string;
  type: "success" | "error";
  duration?: number;
  onClose: () => void;
}

const Toast = ({ message, type, duration = 5000, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
      }`}
    >
      <div
        className={`flex max-w-sm items-center gap-3 rounded-lg p-4 shadow-lg ${
          type === "success"
            ? "border border-green-200 bg-green-50 text-green-800"
            : "border border-red-200 bg-red-50 text-red-800"
        }`}
      >
        {type === "success" ? (
          <IoCheckmarkCircle
            className="flex-shrink-0 text-green-600"
            size={20}
          />
        ) : (
          <IoCloseCircle className="flex-shrink-0 text-red-600" size={20} />
        )}

        <p className="flex-1 text-sm font-medium">{message}</p>

        <button
          onClick={handleClose}
          className={`hover:bg-opacity-20 flex-shrink-0 rounded p-1 ${
            type === "success" ? "hover:bg-green-600" : "hover:bg-red-600"
          }`}
        >
          <IoClose size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
