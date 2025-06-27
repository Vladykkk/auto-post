import { useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { useNavigate } from "react-router";

import { useAuth } from "@/hooks/auth/useAuth";
import type { Platform } from "@/types/api";

import LinkedinForm from "./LinkedinForm";
import MultiPlatformForm from "./MultiPlatformForm";
import PlatformSelector from "./PlatformSelector";
import SubstackForm from "./SubstackForm";
import XForm from "./XForm";

const Form = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | "multi">(
    "linkedin",
  );

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform as Platform | "multi");
  };

  const linkedinConnected = !!auth.linkedin.linkedinUser;
  const xConnected = !!auth.x.xUser;
  const substackConnected =
    !!auth.substack.substackUser &&
    auth.substack.substackUser.status === "logged_in";

  const hasConnections = linkedinConnected || xConnected || substackConnected;
  const hasMultipleConnections =
    [linkedinConnected, xConnected, substackConnected].filter(Boolean).length >
    1;

  return (
    <>
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">
            Social Media Post Creator
          </h1>
          <IoSettingsOutline
            className="cursor-pointer text-gray-600 transition-colors hover:text-gray-800"
            size={32}
            onClick={handleSettingsClick}
            title="Settings"
          />
        </div>

        <PlatformSelector
          selectedPlatform={selectedPlatform}
          onPlatformChange={handlePlatformChange}
          linkedinConnected={linkedinConnected}
          xConnected={xConnected}
          substackConnected={substackConnected}
          showMultiPlatform={hasMultipleConnections}
        />

        {hasConnections && (
          <>
            {selectedPlatform === "multi" && (
              <MultiPlatformForm
                linkedinUser={auth.linkedin.linkedinUser || undefined}
                xUser={auth.x.xUser || undefined}
                substackUser={auth.substack.substackUser || undefined}
              />
            )}
            {selectedPlatform === "linkedin" && auth.linkedin.linkedinUser && (
              <LinkedinForm user={auth.linkedin.linkedinUser} />
            )}
            {selectedPlatform === "x" && auth.x.xUser && (
              <XForm user={auth.x.xUser} />
            )}
            {selectedPlatform === "substack" && auth.substack.substackUser && (
              <SubstackForm user={auth.substack.substackUser} />
            )}
          </>
        )}

        {!hasConnections && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 text-center">
            <h3 className="mb-2 text-lg font-medium text-blue-900">
              Get Started
            </h3>
            <p className="mb-4 text-blue-700">
              Connect your social media accounts in Settings to start creating
              posts.
            </p>
            <button
              onClick={handleSettingsClick}
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Go to Settings
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Form;
