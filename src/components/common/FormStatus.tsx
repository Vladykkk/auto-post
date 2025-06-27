import React from "react";

interface FormStatusProps {
  type: "success" | "error";
  message: string;
  className?: string;
}

const FormStatus: React.FC<FormStatusProps> = ({
  type,
  message,
  className = "",
}) => {
  const isSuccess = type === "success";

  return (
    <div
      className={`rounded-lg border p-4 ${
        isSuccess ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
      } ${className}`}
    >
      <p
        className={`text-center font-medium ${
          isSuccess ? "text-green-700" : "text-red-700"
        }`}
      >
        {isSuccess ? "✅" : "❌"} {message}
      </p>
    </div>
  );
};

export default FormStatus;
