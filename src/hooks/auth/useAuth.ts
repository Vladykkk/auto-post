import { useXAuth } from "@/hooks/auth/useXAuth";
import type { Platform, PlatformUser } from "@/types/api";

import { useLinkedInAuth } from "./useLinkedInAuth";
import { useSubstackAuth } from "./useSubstackAuth";

export const useAuth = () => {
  const linkedinAuth = useLinkedInAuth();
  const xAuth = useXAuth();
  const substackAuth = useSubstackAuth();

  const getCurrentPlatform = (): Platform | null => {
    const hasLinkedIn = !!localStorage.getItem("linkedinAuthToken");
    const hasX = !!localStorage.getItem("xAuthToken");
    const hasSubstack = !!localStorage.getItem("substackAuthToken");

    if (hasSubstack) return "substack";
    if (hasX) return "x";
    if (hasLinkedIn) return "linkedin";
    return null;
  };

  const getCurrentUser = (): PlatformUser | null => {
    const platform = getCurrentPlatform();
    if (platform === "linkedin") {
      return linkedinAuth.linkedinUser;
    } else if (platform === "x") {
      return xAuth.xUser;
    } else if (platform === "substack") {
      return substackAuth.substackUser;
    }
    return null;
  };

  const isAuthenticated = (): boolean => {
    return (
      linkedinAuth.linkedinUser !== null ||
      xAuth.xUser !== null ||
      substackAuth.substackUser !== null
    );
  };

  const isLoading = (): boolean => {
    return linkedinAuth.isLoading || xAuth.isLoading || substackAuth.isLoading;
  };

  const getAuthMethods = (platform: Platform) => {
    if (platform === "linkedin") {
      return {
        user: linkedinAuth.linkedinUser,
        connect: linkedinAuth.connect,
        logout: linkedinAuth.logout,
        checkAuth: linkedinAuth.checkAuth,
      };
    } else if (platform === "x") {
      return {
        user: xAuth.xUser,
        connect: xAuth.connect,
        logout: xAuth.logout,
        checkAuth: xAuth.checkAuth,
      };
    } else if (platform === "substack") {
      return {
        user: substackAuth.substackUser,
        initiateConnection: substackAuth.initiateConnection,
        completeConnection: substackAuth.completeConnection,
        logout: substackAuth.logout,
        checkAuth: substackAuth.checkAuth,
      };
    }
    throw new Error(`Unsupported platform: ${platform}`);
  };

  return {
    linkedin: linkedinAuth,
    x: xAuth,
    substack: substackAuth,

    getCurrentPlatform,
    getCurrentUser,
    isAuthenticated,
    isLoading,
    getAuthMethods,
  };
};
