import React from "react";
import { FaLinkedin } from "react-icons/fa";

import type { LinkedInUser } from "@/types/api";

interface ConnectionStatusProps {
  linkedinUser: LinkedInUser | null;
  isLoading: boolean;
  onConnect: () => void;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  linkedinUser,
  isLoading,
  onConnect,
}: ConnectionStatusProps) => {
  if (isLoading) {
    return (
      <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-6">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Checking connection status...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!linkedinUser && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-6">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-600">
                Connect your social media account to start posting
              </h2>
            </div>
            <FaLinkedin
              size={48}
              color="#0A66C2"
              onClick={onConnect}
              className="cursor-pointer"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ConnectionStatus;
