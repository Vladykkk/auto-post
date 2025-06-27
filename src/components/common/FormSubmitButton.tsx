import React from "react";

interface FormSubmitButtonProps {
  isLoading: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  loadingText?: string;
  variant?: "primary" | "secondary";
  className?: string;
}

const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({
  isLoading,
  disabled = false,
  children,
  loadingText = "Posting...",
  variant = "primary",
  className = "",
}) => {
  const baseClasses =
    "rounded-lg px-6 py-3 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
  };

  return (
    <button
      type="submit"
      disabled={isLoading || disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          {loadingText}
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default FormSubmitButton;
