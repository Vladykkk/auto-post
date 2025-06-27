import type { Platform } from "@/types/api";

interface PlatformSelectorItemProps {
  selectedPlatform: Platform | "multi";
  onPlatformChange: (platform: string) => void;
  linkedinConnected: boolean;
  xConnected: boolean;
  substackConnected: boolean;
  showMultiPlatform?: boolean;
  icon: React.ReactNode;
  label: string;
  value: string;
}

const PlatformSelectorItem = ({
  selectedPlatform,
  onPlatformChange,
  linkedinConnected,
  xConnected,
  substackConnected,
  showMultiPlatform = false,
  icon,
  label,
  value,
}: PlatformSelectorItemProps) => {
  const isConnected = () => {
    switch (value) {
      case "linkedin":
        return linkedinConnected;
      case "x":
        return xConnected;
      case "substack":
        return substackConnected;
      case "multi": {
        const connectedCount = [
          linkedinConnected,
          xConnected,
          substackConnected,
        ].filter(Boolean).length;
        return connectedCount >= 2 && showMultiPlatform;
      }
      default:
        return false;
    }
  };

  const connected = isConnected();

  const getStatusText = () => {
    if (value === "multi") {
      const connectedPlatforms = [];
      if (linkedinConnected) connectedPlatforms.push("LinkedIn");
      if (xConnected) connectedPlatforms.push("X");
      if (substackConnected) connectedPlatforms.push("Substack");

      return connected
        ? `${connectedPlatforms.length} platforms available`
        : "Need 2+ platforms";
    }

    return connected ? "Connected" : "Not connected";
  };

  return (
    <button
      type="button"
      onClick={() => onPlatformChange(value)}
      disabled={!connected}
      className={`relative rounded-lg border-2 p-4 text-left transition-all ${
        selectedPlatform === value
          ? value === "multi"
            ? "border-purple-500 bg-purple-50"
            : "border-sky-500 bg-sky-50"
          : "border-gray-200 bg-white hover:border-gray-300"
      } ${
        !connected
          ? "cursor-not-allowed bg-gray-50 opacity-50"
          : "cursor-pointer"
      }`}
    >
      <div className="flex items-center space-x-3">
        {icon}
        <div>
          <h4 className="font-medium text-gray-900">{label}</h4>
          <p className="text-sm text-gray-500">{getStatusText()}</p>
        </div>
      </div>
      {selectedPlatform === value && (
        <div className="absolute top-2 right-2">
          <div
            className={`h-3 w-3 rounded-full ${
              value === "multi" ? "bg-purple-500" : "bg-sky-500"
            }`}
          ></div>
        </div>
      )}
    </button>
  );
};

export default PlatformSelectorItem;
