import { useCallback } from "react";

export const useFormValidation = () => {
  const validateEmail = useCallback(
    (email: string): { isValid: boolean; error?: string } => {
      if (!email.trim()) {
        return { isValid: false, error: "Please enter your email address" };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return { isValid: false, error: "Please enter a valid email address" };
      }

      return { isValid: true };
    },
    [],
  );

  const validateRequired = useCallback(
    (
      value: string,
      fieldName: string,
    ): { isValid: boolean; error?: string } => {
      if (!value.trim()) {
        return { isValid: false, error: `Please enter ${fieldName}` };
      }
      return { isValid: true };
    },
    [],
  );

  const validateLength = useCallback(
    (
      value: string,
      minLength: number,
      maxLength?: number,
      fieldName: string = "field",
    ): { isValid: boolean; error?: string } => {
      if (value.length < minLength) {
        return {
          isValid: false,
          error: `${fieldName} must be at least ${minLength} characters`,
        };
      }

      if (maxLength && value.length > maxLength) {
        return {
          isValid: false,
          error: `${fieldName} must be no more than ${maxLength} characters`,
        };
      }

      return { isValid: true };
    },
    [],
  );

  const validateVerificationCode = useCallback(
    (code: string): { isValid: boolean; error?: string } => {
      if (!code.trim()) {
        return { isValid: false, error: "Please enter the verification code" };
      }

      if (code.trim().length !== 6) {
        return { isValid: false, error: "Verification code must be 6 digits" };
      }

      return { isValid: true };
    },
    [],
  );

  const validateUrl = useCallback(
    (url: string): { isValid: boolean; error?: string } => {
      if (!url.trim()) {
        return { isValid: false, error: "Please enter a URL" };
      }

      try {
        new URL(url);
        return { isValid: true };
      } catch {
        return { isValid: false, error: "Please enter a valid URL" };
      }
    },
    [],
  );

  return {
    validateEmail,
    validateRequired,
    validateLength,
    validateVerificationCode,
    validateUrl,
  };
};
