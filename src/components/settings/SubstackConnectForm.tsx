import React from "react";

import { useSubstackConnectionFlow } from "@/hooks/form/useSubstackConnectionFlow";
import type { SubstackUser } from "@/types/api";

import Toast from "../Toast";

interface SubstackConnectFormProps {
  isConnected: boolean;
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
  onDisconnect: () => Promise<boolean>;
  isConnecting: boolean;
}

const SubstackConnectForm: React.FC<SubstackConnectFormProps> = ({
  user,
  onConnect,
  onVerify,
  onWaitVerify,
  isConnecting,
}) => {
  const {
    email,
    verificationCode,
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
  } = useSubstackConnectionFlow({
    user,
    onConnect,
    onVerify,
    onWaitVerify,
    isConnecting,
  });

  return (
    <div>
      {isAwaitingVerification ? (
        <form onSubmit={handleVerificationSubmit} className="space-y-4">
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="text-sm text-blue-800">
              <p className="font-medium">Verification code sent!</p>
              <p>
                Check your email ({displayEmail}) for a 6-digit verification
                code.
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="verification-code"
              className="block text-sm font-medium text-gray-700"
            >
              Verification Code *
            </label>
            <input
              id="verification-code"
              type="text"
              value={verificationCode}
              onChange={(e) => handleVerificationCodeChange(e.target.value)}
              placeholder="Enter 6-digit code"
              className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              disabled={isConnecting}
              maxLength={6}
              pattern="[0-9]{6}"
              autoComplete="one-time-code"
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!canSubmitVerification}
              className="flex-1 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isConnecting ? "Verifying..." : "Verify & Connect"}
            </button>
            <button
              type="button"
              onClick={handleStartOver}
              disabled={isConnecting}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Start Over
            </button>
          </div>

          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="text-center">
              <p className="mb-3 text-sm text-gray-600">
                Having trouble with the 6-digit code? Use the recommended email
                link method:
              </p>
              <button
                type="button"
                onClick={handleWaitVerification}
                disabled={isConnecting}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isConnecting
                  ? "Waiting for Email Click..."
                  : "Wait for Email Link Click ⭐"}
              </button>
              <p className="mt-2 text-xs text-gray-500">
                Click this button, then check your email and click the
                verification link. We&apos;ll automatically detect when you
                verify.
              </p>
            </div>
          </div>
        </form>
      ) : (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="substack-email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address *
            </label>
            <input
              id="substack-email"
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="Enter your Substack email"
              className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              disabled={isConnecting}
              autoComplete="email"
            />
            <p className="mt-1 text-xs text-gray-500">
              We&apos;ll send a verification code to this email
            </p>
          </div>

          <button
            type="submit"
            disabled={!canSubmitEmail}
            className="w-full rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isConnecting ? "Sending Code..." : "Send Verification Code"}
          </button>
        </form>
      )}

      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
};

export default SubstackConnectForm;
