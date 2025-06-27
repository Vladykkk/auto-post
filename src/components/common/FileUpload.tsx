import React from "react";
import { IoImageOutline, IoVideocamOutline } from "react-icons/io5";

import type { MediaType } from "@/types/api";

interface FileUploadProps {
  postType: MediaType;
  selectedFile: File | null;
  previewUrl: string | null;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
  getFileAcceptTypes: () => string;
  disabled?: boolean;
  inputId: string;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  postType,
  selectedFile,
  previewUrl,
  onFileSelect,
  onRemoveFile,
  getFileAcceptTypes,
  disabled = false,
  inputId,
  className = "",
}) => {
  if (postType === "TEXT") {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {postType === "IMAGE" ? "Image" : "Video"} Upload
      </label>

      {!selectedFile ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
          <input
            id={inputId}
            type="file"
            accept={getFileAcceptTypes()}
            onChange={onFileSelect}
            className="hidden"
            disabled={disabled}
          />
          <label
            htmlFor={inputId}
            className={`cursor-pointer ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
          >
            {postType === "IMAGE" ? (
              <IoImageOutline
                className="mx-auto mb-2 text-gray-400"
                size={48}
              />
            ) : (
              <IoVideocamOutline
                className="mx-auto mb-2 text-gray-400"
                size={48}
              />
            )}
            <p className="text-sm text-gray-600">
              Click to upload {postType.toLowerCase()}
            </p>
            <p className="text-xs text-gray-500">
              Max size: {postType === "IMAGE" ? "20MB" : "100MB"}
            </p>
          </label>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {postType === "IMAGE" ? (
                <IoImageOutline className="text-blue-600" size={24} />
              ) : (
                <IoVideocamOutline className="text-blue-600" size={24} />
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onRemoveFile}
              className="text-red-600 hover:text-red-800 disabled:opacity-50"
              disabled={disabled}
            >
              Remove
            </button>
          </div>

          {previewUrl && postType === "IMAGE" && (
            <div className="mt-3">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-32 rounded-lg object-cover"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
