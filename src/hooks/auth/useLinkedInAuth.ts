import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import { linkedInApi, redirectToLinkedInAuth } from "@/services/api";
import type { LinkedInUser } from "@/types/api";

export const useLinkedInAuth = () => {
  const [searchParams] = useSearchParams();
  const [linkedinUser, setLinkedinUser] = useState<LinkedInUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("linkedinAuthToken");
    console.log(
      "LinkedIn auth - checkAuth called, token:",
      token ? "present" : "none",
    );

    try {
      const userData = await linkedInApi.checkAuth();
      console.log("LinkedIn auth - checkAuth success:", userData);
      setLinkedinUser(userData);
    } catch (error) {
      console.error("LinkedIn auth - checkAuth error:", error);
      setLinkedinUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleTokenFromURL = useCallback(() => {
    const token = searchParams.get("token");
    const provider = searchParams.get("provider");

    console.log("LinkedIn auth - Full URL:", window.location.href);
    console.log("LinkedIn auth - URL params:", {
      token: token ? "present" : "none",
      provider,
      allParams: Object.fromEntries(searchParams.entries()),
    });

    if (token && (provider === "linkedin" || !provider)) {
      console.log("LinkedIn auth - Setting token in localStorage");
      localStorage.setItem("linkedinAuthToken", token);

      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("token");
      newSearchParams.delete("provider");

      const newURL = newSearchParams.toString()
        ? `${window.location.pathname}?${newSearchParams.toString()}`
        : window.location.pathname;

      window.history.replaceState({}, "", newURL);

      checkAuth();
    }
  }, [searchParams, checkAuth]);

  const connect = () => {
    redirectToLinkedInAuth();
  };

  const logout = async () => {
    try {
      await linkedInApi.logout();
      setLinkedinUser(null);
      return true;
    } catch (error) {
      console.error("Error logging out:", error);
      return false;
    }
  };

  useEffect(() => {
    handleTokenFromURL();
    const token = searchParams.get("token");
    const provider = searchParams.get("provider");
    if (!(token && (provider === "linkedin" || !provider))) {
      checkAuth();
    }
  }, [handleTokenFromURL, checkAuth, searchParams]);

  return {
    linkedinUser,
    isLoading,
    connect,
    logout,
    checkAuth,
  };
};
