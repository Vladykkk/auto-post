import { useCallback, useEffect, useState } from "react";

import { substackApi } from "@/services/api";
import type { SubstackUser } from "@/types/api";

export const useSubstackAuth = () => {
  const [substackUser, setSubstackUser] = useState<SubstackUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("substackAuthToken");
    console.log(
      "Substack auth - checkAuth called, token:",
      token ? "present" : "none",
    );

    try {
      const userData = await substackApi.checkAuth();
      console.log("Substack auth - checkAuth success:", userData);
      setSubstackUser(userData);
    } catch (error) {
      console.error("Substack auth - checkAuth error:", error);
      setSubstackUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const initiateConnection = async (email: string) => {
    setIsConnecting(true);
    try {
      const sessionResponse = await substackApi.createSession();

      if (sessionResponse.success && sessionResponse.data.sessionId) {
        const loginResponse = await substackApi.startLogin({
          sessionId: sessionResponse.data.sessionId,
          email: email.trim(),
        });

        if (loginResponse.success) {
          return {
            success: true,
            message: loginResponse.message,
            sessionId: sessionResponse.data.sessionId,
          };
        } else {
          throw new Error("Failed to start login");
        }
      } else {
        throw new Error("Failed to create session");
      }
    } catch (error) {
      console.error("Error initiating Substack connection:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to initiate connection";
      return { success: false, error: errorMessage };
    } finally {
      setIsConnecting(false);
    }
  };

  const completeConnection = async (
    sessionId: string,
    verificationCode: string,
  ) => {
    setIsConnecting(true);
    try {
      const response = await substackApi.verifyCode({
        sessionId,
        verificationCode,
      });

      if (response.success) {
        try {
          const user = await substackApi.getCurrentUser();
          setSubstackUser(user);
          return { success: true, user };
        } catch (error) {
          console.warn(
            "Could not get user via token after code verification:",
            error,
          );
          return { success: true, message: "Verification successful" };
        }
      } else {
        throw new Error("Failed to verify code");
      }
    } catch (error) {
      console.error("Error completing Substack connection:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to verify code";
      return { success: false, error: errorMessage };
    } finally {
      setIsConnecting(false);
    }
  };

  const completeConnectionWithWait = async (
    sessionId: string,
    timeoutSeconds = 300,
  ) => {
    setIsConnecting(true);
    try {
      const response = await substackApi.waitVerify({
        sessionId,
        timeoutSeconds,
      });

      if (response.success && response.data) {
        if (response.data.substackAuthToken) {
          try {
            const user = await substackApi.getCurrentUser();
            setSubstackUser(user);
            return { success: true, user };
          } catch (error) {
            console.error("Could not get user via token:", error);
            throw new Error(
              "Failed to get user information after verification",
            );
          }
        } else {
          throw new Error("No auth token received after verification");
        }
      } else {
        throw new Error("Failed to verify via email link");
      }
    } catch (error) {
      console.error("Error waiting for Substack email verification:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to verify via email link";
      return { success: false, error: errorMessage };
    } finally {
      setIsConnecting(false);
    }
  };

  const logout = async () => {
    try {
      await substackApi.logout();
      setSubstackUser(null);
      return true;
    } catch (error) {
      console.error("Error logging out:", error);
      return false;
    }
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    substackUser,
    isLoading,
    isConnecting,
    initiateConnection,
    completeConnection,
    completeConnectionWithWait,
    logout,
    checkAuth,
  };
};
