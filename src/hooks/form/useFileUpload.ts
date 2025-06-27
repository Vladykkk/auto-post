import { useCallback, useState } from "react";

import type { MediaType } from "@/types/api";

interface UseFileUploadOptions {
  maxImageSize?: number;
  maxVideoSize?: number;
  onError?: (message: string) => void;
}

interface FileUploadState {
  selectedFile: File | null;
  previewUrl: string | null;
  isValidFile: boolean;
}

export const useFileUpload = (options: UseFileUploadOptions = {}) => {
  const {
    maxImageSize = 20 * 1024 * 1024,
    maxVideoSize = 100 * 1024 * 1024,
    onError,
  } = options;

  const [fileState, setFileState] = useState<FileUploadState>({
    selectedFile: null,
    previewUrl: null,
    isValidFile: false,
  });

  const validateFile = useCallback(
    (file: File, postType: MediaType): { isValid: boolean; error?: string } => {
      if (postType === "IMAGE" && !file.type.startsWith("image/")) {
        return {
          isValid: false,
          error: "Please select a valid image file for image posts",
        };
      }

      if (postType === "VIDEO" && !file.type.startsWith("video/")) {
        return {
          isValid: false,
          error: "Please select a valid video file for video posts",
        };
      }

      const maxSize = postType === "IMAGE" ? maxImageSize : maxVideoSize;
      if (file.size > maxSize) {
        const sizeLabel = postType === "IMAGE" ? "20MB" : "100MB";
        return {
          isValid: false,
          error: `File size exceeds limit (${sizeLabel})`,
        };
      }

      return { isValid: true };
    },
    [maxImageSize, maxVideoSize],
  );

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, postType: MediaType) => {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      const validation = validateFile(file, postType);

      if (!validation.isValid) {
        onError?.(validation.error!);
        return;
      }

      if (fileState.previewUrl) {
        URL.revokeObjectURL(fileState.previewUrl);
      }

      const newPreviewUrl = URL.createObjectURL(file);

      setFileState({
        selectedFile: file,
        previewUrl: newPreviewUrl,
        isValidFile: true,
      });
    },
    [fileState.previewUrl, validateFile, onError],
  );

  const handleRemoveFile = useCallback(
    (inputId?: string) => {
      if (fileState.previewUrl) {
        URL.revokeObjectURL(fileState.previewUrl);
      }

      setFileState({
        selectedFile: null,
        previewUrl: null,
        isValidFile: false,
      });

      if (inputId) {
        const fileInput = document.getElementById(inputId) as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }
      }
    },
    [fileState.previewUrl],
  );

  const handlePostTypeChange = useCallback(
    (newType: MediaType, currentFile: File | null) => {
      if (!currentFile) return;

      if (newType === "IMAGE" && !currentFile.type.startsWith("image/")) {
        handleRemoveFile();
      } else if (
        newType === "VIDEO" &&
        !currentFile.type.startsWith("video/")
      ) {
        handleRemoveFile();
      } else if (newType === "TEXT") {
        handleRemoveFile();
      }
    },
    [handleRemoveFile],
  );

  const getFileAcceptTypes = useCallback((postType: MediaType): string => {
    switch (postType) {
      case "IMAGE":
        return "image/*";
      case "VIDEO":
        return "video/*";
      default:
        return "";
    }
  }, []);

  const resetFileState = useCallback(() => {
    handleRemoveFile();
  }, [handleRemoveFile]);

  return {
    selectedFile: fileState.selectedFile,
    previewUrl: fileState.previewUrl,
    isValidFile: fileState.isValidFile,

    handleFileSelect,
    handleRemoveFile,
    handlePostTypeChange,
    getFileAcceptTypes,
    resetFileState,
    validateFile,
  };
};
