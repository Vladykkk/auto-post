import React, { type ReactNode } from "react";

import type { LinkedInUser, SubstackUser, XUser } from "@/types/api";

interface PlatformConnectionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  isConnected: boolean;
  isLoading?: boolean;
  user?: LinkedInUser | XUser | SubstackUser | null;
  onDisconnect: () => void;
  disconnecting?: boolean;
  children?: ReactNode;
}

const PlatformConnectionCard: React.FC<PlatformConnectionCardProps> = ({
  title,
  description,
  icon,
  isConnected,
  isLoading = false,
  user,
  onDisconnect,
  disconnecting = false,
  children,
}) => {
  const getUserDisplayInfo = () => {
    if (!user) return null;

    if ("firstName" in user) {
      const linkedinUser = user as LinkedInUser;
      return {
        name: `${linkedinUser.firstName} ${linkedinUser.lastName}`,
        identifier: linkedinUser.email,
        additionalInfo: null,
      };
    } else if ("username" in user) {
      const xUser = user as XUser;
      return {
        name: xUser.name,
        identifier: `@${xUser.username}`,
        additionalInfo: xUser.verified ? "✓ Verified" : null,
      };
    } else if ("email" in user) {
      const substackUser = user as SubstackUser;
      return {
        name: substackUser.name || "Substack User",
        identifier: substackUser.email,
        additionalInfo:
          substackUser.publications && substackUser.publications.length > 0
            ? `Publications: ${substackUser.publications.map((p) => p.name).join(", ")}`
            : null,
      };
    }

    return null;
  };

  const userInfo = getUserDisplayInfo();

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        {isConnected && (
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-green-600">
              Connected
            </span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      ) : isConnected && userInfo ? (
        <div className="space-y-4">
          <div className="rounded-lg bg-green-50 p-4">
            <div className="text-sm">
              <p className="font-medium text-green-800">Connected as</p>
              <p className="text-green-700">
                {userInfo.name} ({userInfo.identifier})
              </p>
              {userInfo.additionalInfo && (
                <p className="mt-1 text-green-700">{userInfo.additionalInfo}</p>
              )}
            </div>
          </div>

          <button
            onClick={onDisconnect}
            disabled={disconnecting}
            className="w-full rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {disconnecting ? "Disconnecting..." : "Disconnect Account"}
          </button>
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default PlatformConnectionCard;
