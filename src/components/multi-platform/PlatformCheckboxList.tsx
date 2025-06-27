import React from "react";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { IoCheckbox, IoSquareOutline } from "react-icons/io5";
import { SiSubstack } from "react-icons/si";

import type { LinkedInUser, Platform, SubstackUser, XUser } from "@/types/api";
import type { PlatformInfo } from "@/types/platform";

interface PlatformCheckboxListProps {
  selectedPlatforms: Platform[];
  onPlatformToggle: (platformId: Platform) => void;
  onSelectAll: () => void;
  linkedinUser?: LinkedInUser;
  xUser?: XUser;
  substackUser?: SubstackUser;
  disabled?: boolean;
}

const PlatformCheckboxList: React.FC<PlatformCheckboxListProps> = ({
  selectedPlatforms,
  onPlatformToggle,
  onSelectAll,
  linkedinUser,
  xUser,
  substackUser,
  disabled = false,
}) => {
  const availablePlatforms: PlatformInfo[] = [
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: <FaLinkedin className="text-blue-600" />,
      connected: !!linkedinUser,
      user: linkedinUser,
    },
    {
      id: "x",
      name: "X (Twitter)",
      icon: <FaXTwitter className="text-black" />,
      connected: !!xUser,
      user: xUser,
    },
    {
      id: "substack",
      name: "Substack",
      icon: <SiSubstack className="text-orange-600" />,
      connected: !!substackUser && substackUser.status === "logged_in",
      user: substackUser,
    },
  ];

  const connectedPlatforms = availablePlatforms.filter((p) => p.connected);

  const getUserDisplayName = (platform: PlatformInfo): string => {
    if (!platform.user) return "Connected";

    if ("firstName" in platform.user) {
      return `${platform.user.firstName} ${platform.user.lastName}`;
    }
    if ("name" in platform.user) {
      return platform.user.name || "Connected";
    }
    return "Connected";
  };

  if (connectedPlatforms.length === 0) {
    return (
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 text-center">
        <h3 className="mb-2 text-lg font-medium text-blue-900">
          No Connected Platforms
        </h3>
        <p className="text-blue-700">
          Connect your social media accounts in Settings to use multi-platform
          posting.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Select Platforms ({selectedPlatforms.length} selected)
        </label>
        <button
          type="button"
          onClick={onSelectAll}
          disabled={disabled}
          className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
        >
          {selectedPlatforms.length === connectedPlatforms.length
            ? "Deselect All"
            : "Select All"}
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {connectedPlatforms.map((platform) => (
          <div
            key={platform.id}
            onClick={() => !disabled && onPlatformToggle(platform.id)}
            className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
              selectedPlatforms.includes(platform.id)
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {platform.icon}
                <div>
                  <p className="font-medium text-gray-900">{platform.name}</p>
                  <p className="text-xs text-gray-500">
                    {getUserDisplayName(platform)}
                  </p>
                </div>
              </div>
              {selectedPlatforms.includes(platform.id) ? (
                <IoCheckbox className="text-blue-600" size={20} />
              ) : (
                <IoSquareOutline className="text-gray-400" size={20} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformCheckboxList;
