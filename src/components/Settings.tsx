import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { IoArrowBackOutline } from "react-icons/io5";
import { SiSubstack } from "react-icons/si";
import { useNavigate } from "react-router";

import { usePlatformConnections } from "@/hooks/form/usePlatformConnections";
import { useToastNotifications } from "@/hooks/toast/useToastNotifications";

import Toast from "./Toast";
import ConnectButton from "./settings/ConnectButton";
import PlatformConnectionCard from "./settings/PlatformConnectionCard";
import SubstackConnectForm from "./settings/SubstackConnectForm";

const Settings = () => {
  const navigate = useNavigate();
  const { toast, hideToast } = useToastNotifications();
  const {
    auth,
    disconnecting,
    handleLinkedInConnect,
    handleLinkedInDisconnect,
    handleXConnect,
    handleXDisconnect,
    handleSubstackConnect,
    handleSubstackVerify,
    handleSubstackWaitVerify,
    handleSubstackDisconnect,
  } = usePlatformConnections();

  const handleGoBack = () => {
    navigate("/");
  };

  if (auth.linkedin.isLoading || auth.x.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 px-4 shadow-lg">
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={handleGoBack}
            className="flex cursor-pointer items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <IoArrowBackOutline size={20} />
            Back to Home
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your social media connections and preferences
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Platform Connections
            </h2>
            <div className="space-y-4">
              <PlatformConnectionCard
                title="LinkedIn Connection"
                description="Connect your LinkedIn account to share professional content"
                icon={<FaLinkedin size={24} className="text-blue-600" />}
                isConnected={!!auth.linkedin.linkedinUser}
                isLoading={auth.linkedin.isLoading}
                user={auth.linkedin.linkedinUser}
                onDisconnect={handleLinkedInDisconnect}
                disconnecting={disconnecting.linkedin}
              >
                <ConnectButton linkedin handleConnect={handleLinkedInConnect}>
                  Connect LinkedIn Account
                </ConnectButton>
              </PlatformConnectionCard>

              <PlatformConnectionCard
                title="X (Twitter) Connection"
                description="Connect your X account to share posts and updates"
                icon={<FaXTwitter size={24} className="text-black" />}
                isConnected={!!auth.x.xUser}
                isLoading={auth.x.isLoading}
                user={auth.x.xUser}
                onDisconnect={handleXDisconnect}
                disconnecting={disconnecting.x}
              >
                <ConnectButton x handleConnect={handleXConnect}>
                  Connect X Account
                </ConnectButton>
              </PlatformConnectionCard>

              <PlatformConnectionCard
                title="Substack"
                description="Connect your Substack account to publish posts"
                icon={<SiSubstack size={24} className="text-orange-600" />}
                isConnected={
                  !!auth.substack.substackUser &&
                  auth.substack.substackUser.status === "logged_in"
                }
                isLoading={auth.substack.isLoading}
                user={auth.substack.substackUser}
                onDisconnect={handleSubstackDisconnect}
                disconnecting={auth.substack.isConnecting}
              >
                <SubstackConnectForm
                  isConnected={false}
                  user={auth.substack.substackUser}
                  onConnect={handleSubstackConnect}
                  onVerify={handleSubstackVerify}
                  onWaitVerify={handleSubstackWaitVerify}
                  onDisconnect={handleSubstackDisconnect}
                  isConnecting={auth.substack.isConnecting}
                />
              </PlatformConnectionCard>
            </div>
          </div>
        </div>
      </div>

      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
};

export default Settings;
