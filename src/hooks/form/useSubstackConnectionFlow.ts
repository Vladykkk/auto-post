import { useState } from "react";

import type { SubstackUser } from "@/types/api";

import { useToastNotifications } from "../toast/useToastNotifications";
import { useFormValidation } from "./useFormValidation";

interface SubstackConnectionFlowProps {
  user: SubstackUser | null;
  onConnect: (email: string) => Promise<{
    success: boolean;
    message?: string;
    error?: string;
    sessionId?: string;
  }>;
  onVerify: (
    sessionId: string,
    code: string,
  ) => Promise<{ success: boolean; error?: string }>;
  onWaitVerify: (
    sessionId: string,
  ) => Promise<{ success: boolean; error?: string }>;
  isConnecting: boolean;
}

export const useSubstackConnectionFlow = ({
  user,
  onConnect,
  onVerify,
  onWaitVerify,
  isConnecting,
}: SubstackConnectionFlowProps) => {
  const { toast, showToast, hideToast } = useToastNotifications();
  const {
    validateEmail: validateEmailFormat,
    validateVerificationCode: validateCodeFormat,
  } = useFormValidation();

  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [awaitingVerification, setAwaitingVerification] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState("");

  const validateEmail = (emailValue: string): boolean => {
    const result = validateEmailFormat(emailValue);
    if (!result.isValid && result.error) {
      showToast(result.error, "error");
      return false;
    }
    return true;
  };

  const validateVerificationCode = (code: string): boolean => {
    const result = validateCodeFormat(code);
    if (!result.isValid && result.error) {
      showToast(result.error, "error");
      return false;
    }
    return true;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) return;

    try {
      const result = await onConnect(email.trim());

      if (result.success && result.sessionId) {
        setCurrentSessionId(result.sessionId);
        setAwaitingVerification(true);
        showToast(
          result.message || "Verification code sent! Check your email.",
          "success",
        );
      } else {
        showToast(result.error || "Failed to send verification code", "error");
      }
    } catch (error) {
      console.error("Connection error:", error);
      showToast("Failed to connect. Please try again.", "error");
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateVerificationCode(verificationCode)) return;

    try {
      const sessionId = currentSessionId || user?.sessionId;
      if (!sessionId) {
        showToast("Session expired. Please restart the process.", "error");
        handleStartOver();
        return;
      }

      const result = await onVerify(sessionId, verificationCode.trim());

      if (result.success) {
        showToast("Successfully connected to Substack!", "success");
        resetFormState();
      } else {
        showToast(result.error || "Invalid verification code", "error");
      }
    } catch (error) {
      console.error("Verification error:", error);
      showToast("Failed to verify code. Please try again.", "error");
    }
  };

  const handleWaitVerification = async () => {
    try {
      const sessionId = currentSessionId || user?.sessionId;
      if (!sessionId) {
        showToast("Session expired. Please restart the process.", "error");
        handleStartOver();
        return;
      }

      showToast(
        "Waiting for email verification... Please check your email and click the verification link.",
        "success",
      );

      const result = await onWaitVerify(sessionId);

      if (result.success) {
        showToast(
          "Successfully connected to Substack via email verification!",
          "success",
        );
        resetFormState();
      } else {
        showToast(
          result.error || "Email verification failed or timed out",
          "error",
        );
      }
    } catch (error) {
      console.error("Wait verification error:", error);
      showToast("Email verification failed. Please try again.", "error");
    }
  };

  const resetFormState = () => {
    setEmail("");
    setVerificationCode("");
    setAwaitingVerification(false);
    setCurrentSessionId("");
  };

  const handleStartOver = () => {
    resetFormState();
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
  };

  const handleVerificationCodeChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 6);
    setVerificationCode(numericValue);
  };

  const isAwaitingVerification =
    awaitingVerification || (user && user.status === "awaiting_verification");
  const displayEmail = user?.email || email;
  const canSubmitEmail = !isConnecting && email.trim();
  const canSubmitVerification = !isConnecting && verificationCode.length === 6;

  return {
    email,
    verificationCode,
    awaitingVerification,
    currentSessionId,
    toast,
    isAwaitingVerification,
    displayEmail,
    canSubmitEmail,
    canSubmitVerification,
    handleEmailSubmit,
    handleVerificationSubmit,
    handleWaitVerification,
    handleStartOver,
    handleEmailChange,
    handleVerificationCodeChange,
    hideToast,
  };
};
