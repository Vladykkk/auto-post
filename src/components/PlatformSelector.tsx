import { PLATFORM_SELECTOR_OPTIONS } from "@/consts/form";
import type { Platform } from "@/types/api";

import PlatformSelectorItem from "./form/PlatformSelectorItem";

interface PlatformSelectorProps {
  selectedPlatform: Platform | "multi";
  onPlatformChange: (platform: string) => void;
  linkedinConnected: boolean;
  xConnected: boolean;
  substackConnected: boolean;
  showMultiPlatform?: boolean;
}

const PlatformSelector = ({
  selectedPlatform,
  onPlatformChange,
  linkedinConnected,
  xConnected,
  substackConnected,
  showMultiPlatform = false,
}: PlatformSelectorProps) => {
  const availableOptions = PLATFORM_SELECTOR_OPTIONS.filter((option) => {
    if (option.value === "multi") {
      return showMultiPlatform;
    }
    return true;
  });

  return (
    <div className="mb-6">
      <h3 className="mb-3 text-lg font-semibold text-gray-900">
        Choose Platform
      </h3>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {availableOptions.map((option) => (
          <PlatformSelectorItem
            key={option.value}
            selectedPlatform={selectedPlatform}
            onPlatformChange={onPlatformChange}
            linkedinConnected={linkedinConnected}
            xConnected={xConnected}
            substackConnected={substackConnected}
            showMultiPlatform={showMultiPlatform}
            icon={option.icon}
            label={option.label}
            value={option.value}
          />
        ))}
      </div>

      {!linkedinConnected && !xConnected && !substackConnected && (
        <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                No platforms connected
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Connect to LinkedIn, X, or Substack in Settings to start
                  creating posts.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformSelector;
