import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import { linkedInApi, redirectToLinkedInAuth } from "@/services/api";
import type { LinkedInUser } from "@/types/api";

export const useLinkedInAuth = () => {
  const [searchParams] = useSearchParams();
  const [linkedinUser, setLinkedinUser] = useState<LinkedInUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Handle token from URL parameters after OAuth redirect
  const handleTokenFromURL = () => {
    const token = searchParams.get("token");

    if (token) {
      // Store token in localStorage
      localStorage.setItem("authToken", token);

      // Clean up URL by removing the token parameter
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("token");

      // Update URL without the token parameter
      const newURL = newSearchParams.toString()
        ? `${window.location.pathname}?${newSearchParams.toString()}`
        : window.location.pathname;

      window.history.replaceState({}, "", newURL);
    }
  };

  // Check LinkedIn authentication status
  const checkAuth = async () => {
    try {
      const userData = await linkedInApi.checkAuth();
      setLinkedinUser(userData);
    } catch (error) {
      console.error("Error checking LinkedIn auth:", error);
      setLinkedinUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Connect to LinkedIn
  const connect = () => {
    redirectToLinkedInAuth();
  };

  // Logout from LinkedIn
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
    checkAuth();
  }, []);

  return {
    linkedinUser,
    isLoading,
    connect,
    logout,
    checkAuth,
  };
};
