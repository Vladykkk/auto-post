import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import { redirectToXAuth, xApi } from "@/services/api";
import type { XUser } from "@/types/api";

export const useXAuth = () => {
  const [searchParams] = useSearchParams();
  const [xUser, setXUser] = useState<XUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleTokenFromURL = () => {
    const token = searchParams.get("token");
    const provider = searchParams.get("provider");

    if (token && provider === "x") {
      localStorage.setItem("xAuthToken", token);

      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("token");
      newSearchParams.delete("provider");

      const newURL = newSearchParams.toString()
        ? `${window.location.pathname}?${newSearchParams.toString()}`
        : window.location.pathname;

      window.history.replaceState({}, "", newURL);
    }
  };

  const checkAuth = async () => {
    try {
      const userData = await xApi.checkAuth();
      setXUser(userData);
    } catch (error) {
      console.error("Error checking X auth:", error);
      setXUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const connect = () => {
    redirectToXAuth();
  };

  const logout = async () => {
    try {
      await xApi.logout();
      setXUser(null);
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
    xUser,
    isLoading,
    connect,
    logout,
    checkAuth,
  };
};
