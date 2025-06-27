import { useState } from "react";

import { useAuth } from "../auth/useAuth";
import { useToastNotifications } from "../toast/useToastNotifications";

export const usePlatformConnections = () => {
  const auth = useAuth();
  const { showToast } = useToastNotifications();

  const [disconnecting, setDisconnecting] = useState({
    linkedin: false,
    x: false,
    substack: false,
  });

  const handleLinkedInConnect = async (): Promise<void> => {
    try {
      await auth.linkedin.connect();
      showToast("LinkedIn connection initiated", "success");
    } catch (error) {
      console.error("LinkedIn connection failed:", error);
      showToast("Failed to connect to LinkedIn", "error");
    }
  };

  const handleLinkedInDisconnect = async () => {
    setDisconnecting((prev) => ({ ...prev, linkedin: true }));
    try {
      const success = await auth.linkedin.logout();
      if (success) {
        showToast("Successfully disconnected from LinkedIn", "success");
      } else {
        showToast("Failed to disconnect from LinkedIn", "error");
      }
    } catch (error) {
      console.error("LinkedIn disconnect failed:", error);
      showToast("Failed to disconnect from LinkedIn", "error");
    } finally {
      setDisconnecting((prev) => ({ ...prev, linkedin: false }));
    }
  };

  const handleXConnect = async (): Promise<void> => {
    try {
      await auth.x.connect();
      showToast("X connection initiated", "success");
    } catch (error) {
      console.error("X connection failed:", error);
      showToast("Failed to connect to X", "error");
    }
  };

  const handleXDisconnect = async () => {
    setDisconnecting((prev) => ({ ...prev, x: true }));
    try {
      const success = await auth.x.logout();
      if (success) {
        showToast("Successfully disconnected from X", "success");
      } else {
        showToast("Failed to disconnect from X", "error");
      }
    } catch (error) {
      console.error("X disconnect failed:", error);
      showToast("Failed to disconnect from X", "error");
    } finally {
      setDisconnecting((prev) => ({ ...prev, x: false }));
    }
  };

  const handleSubstackConnect = async (email: string) => {
    try {
      const result = await auth.substack.initiateConnection(email);
      if (result.success) {
        return {
          success: true,
          message: result.message,
          sessionId: result.sessionId,
        };
      } else {
        return {
          success: false,
          error: result.error || "Failed to initiate connection",
        };
      }
    } catch (error) {
      console.error("Substack connection failed:", error);
      return {
        success: false,
        error: "Failed to connect to Substack",
      };
    }
  };

  const handleSubstackVerify = async (sessionId: string, code: string) => {
    try {
      const result = await auth.substack.completeConnection(sessionId, code);
      if (result.success) {
        showToast("Successfully connected to Substack!", "success");
        return { success: true };
      } else {
        return {
          success: false,
          error: result.error || "Failed to verify code",
        };
      }
    } catch (error) {
      console.error("Substack verification failed:", error);
      return {
        success: false,
        error: "Failed to verify code",
      };
    }
  };

  const handleSubstackWaitVerify = async (sessionId: string) => {
    try {
      const result = await auth.substack.completeConnectionWithWait(
        sessionId,
        300,
      );
      if (result.success) {
        showToast(
          "Successfully connected to Substack via email verification!",
          "success",
        );
        return { success: true };
      } else {
        return {
          success: false,
          error: result.error || "Failed to verify via email link",
        };
      }
    } catch (error) {
      console.error("Substack email verification failed:", error);
      return {
        success: false,
        error: "Failed to verify via email link",
      };
    }
  };

  const handleSubstackDisconnect = async (): Promise<boolean> => {
    setDisconnecting((prev) => ({ ...prev, substack: true }));
    try {
      const success = await auth.substack.logout();
      if (success) {
        showToast("Successfully disconnected from Substack", "success");
      } else {
        showToast("Failed to disconnect from Substack", "error");
      }
      return success;
    } catch (error) {
      console.error("Substack disconnect failed:", error);
      showToast("Failed to disconnect from Substack", "error");
      return false;
    } finally {
      setDisconnecting((prev) => ({ ...prev, substack: false }));
    }
  };

  return {
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
  };
};
