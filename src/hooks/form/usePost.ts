import { useState } from "react";

import { linkedInApi } from "@/services/api";
import type {
  CreatePostRequest,
  CreatePostResponse,
  LinkedInVisibility,
  MediaType,
} from "@/types/api";

interface UsePostOptions {
  onSuccess?: (response: CreatePostResponse) => void;
  onError?: (error: string) => void;
}

export const usePost = (options: UsePostOptions = {}) => {
  const [isPosting, setIsPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const submitPost = async (
    text: string,
    file: File | null = null,
    visibility: LinkedInVisibility = "PUBLIC",
    postType: MediaType = "TEXT",
    articleData?: {
      url: string;
      title: string;
      description?: string;
    },
  ): Promise<CreatePostResponse | undefined> => {
    setIsPosting(true);
    setPostError(null);
    setPostSuccess(false);
    setUploadProgress(0);

    try {
      let mediaAssetUrn: string | undefined;

      if (file && (postType === "IMAGE" || postType === "VIDEO")) {
        setUploadProgress(10);

        try {
          const uploadResponse = await linkedInApi.uploadMedia(
            file,
            `${postType === "IMAGE" ? "Image" : "Video"} from Auto-Post App`,
            `${postType === "IMAGE" ? "Image" : "Video"} uploaded via Auto-Post application`,
          );

          if (uploadResponse.success && uploadResponse.data?.assetUrn) {
            mediaAssetUrn = uploadResponse.data.assetUrn;
            setUploadProgress(75);
          } else {
            throw new Error(uploadResponse.message || "Failed to upload media");
          }
        } catch (uploadError) {
          console.error("Media upload failed:", uploadError);
          throw new Error(
            uploadError instanceof Error
              ? `Upload failed: ${uploadError.message}`
              : "Failed to upload media file",
          );
        }
      }

      setUploadProgress(80);

      const postData: CreatePostRequest = {
        text: text.trim(),
        visibility,
        ...(postType !== "TEXT" && { mediaType: postType }),
        ...(mediaAssetUrn && {
          media: [
            {
              assetUrn: mediaAssetUrn,
              title: `${postType === "IMAGE" ? "Image" : "Video"} from Auto-Post App`,
              description: `${postType === "IMAGE" ? "Image" : "Video"} uploaded via Auto-Post application`,
            },
          ],
        }),
        ...(articleData && {
          articleUrl: articleData.url,
          articleTitle: articleData.title,
          ...(articleData.description && {
            articleDescription: articleData.description,
          }),
        }),
      };

      console.log("Creating post with data:", postData);

      const response = await linkedInApi.createPost(postData);
      setUploadProgress(90);

      if (response.success) {
        setUploadProgress(100);
        setPostSuccess(true);
        options.onSuccess?.(response);

        setTimeout(() => {
          setPostSuccess(false);
        }, 5000);

        return response;
      } else {
        throw new Error(response.message || "Failed to create post");
      }
    } catch (error) {
      console.error("Post submission failed:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while posting";

      setPostError(errorMessage);
      options.onError?.(errorMessage);

      setTimeout(() => {
        setPostError(null);
      }, 10000);
    } finally {
      setIsPosting(false);
      setUploadProgress(0);
    }
  };

  const resetState = () => {
    setPostSuccess(false);
    setPostError(null);
    setUploadProgress(0);
  };

  return {
    isPosting,
    postSuccess,
    postError,
    uploadProgress,
    submitPost,
    resetState,
  };
};
