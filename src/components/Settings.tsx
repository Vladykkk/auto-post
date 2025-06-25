import React, { useState } from "react";
import { FaLinkedin } from "react-icons/fa";
import { IoArrowBack, IoPersonOutline } from "react-icons/io5";
import { useNavigate } from "react-router";

import { useLinkedInAuth } from "@/hooks/useLinkedInAuth";

import Toast from "./Toast";

interface ToastState {
  message: string;
  type: "success" | "error";
  show: boolean;
}

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { linkedinUser, isLoading, connect, logout } = useLinkedInAuth();
  const [disconnecting, setDisconnecting] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    message: "",
    type: "success",
    show: false,
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type, show: true });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 5000);
  };

  const handleConnect = () => {
    connect();
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      const success = await logout();
      if (success) {
        showToast("Successfully disconnected from LinkedIn", "success");
      } else {
        showToast("Failed to disconnect. Please try again.", "error");
      }
    } catch (error) {
      console.error("Disconnect error:", error);
      showToast("Error disconnecting from LinkedIn", "error");
    } finally {
      setDisconnecting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 pt-8">
        {/* Header with back button */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <button
            onClick={() => navigate("/")}
            className="flex cursor-pointer items-center gap-2 text-gray-600 transition-colors hover:text-gray-800"
            title="Back to Home"
          >
            <IoArrowBack size={24} />
            <span className="font-medium">Back to Home</span>
          </button>
        </div>

        {/* LinkedIn Connection Status */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <FaLinkedin size={24} color="#0A66C2" className="cursor-pointer" />
            LinkedIn Connection
          </h2>

          {linkedinUser ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <IoPersonOutline className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-900">
                      {linkedinUser.firstName} {linkedinUser.lastName}
                    </p>
                    <p className="text-sm text-green-700">
                      {linkedinUser.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="mr-3 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Connected
                  </span>
                  <button
                    onClick={handleDisconnect}
                    disabled={disconnecting}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:bg-red-400"
                  >
                    {disconnecting ? "Disconnecting..." : "Disconnect"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={handleConnect}
                className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
              >
                Connect LinkedIn Account
              </button>
            </div>
          )}
        </div>

        {/* Toast Notification */}
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast((prev) => ({ ...prev, show: false }))}
          />
        )}
      </div>
    </div>
  );
};

export default Settings;
