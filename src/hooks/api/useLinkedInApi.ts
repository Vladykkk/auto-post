import { useCallback, useState } from "react";

import { linkedInApi } from "@/services/api";
import type {
  CreatePostRequest,
  CreatePostResponse,
  LinkedInUser,
  MediaUploadResponse,
} from "@/types/api";

export const useLinkedInApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async (): Promise<LinkedInUser | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await linkedInApi.checkAuth();
      return user;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to check authentication";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadMedia = useCallback(
    async (
      file: File,
      title: string,
      description: string,
    ): Promise<MediaUploadResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await linkedInApi.uploadMedia(
          file,
          title,
          description,
        );
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to upload media";
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const createPost = useCallback(
    async (postData: CreatePostRequest): Promise<CreatePostResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await linkedInApi.createPost(postData);
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create post";
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const success = await linkedInApi.logout();
      return success;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to logout";
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    checkAuth,
    uploadMedia,
    createPost,
    logout,
    clearError,
  };
};
