import { useState } from "react";
import {
  IoDocumentTextOutline,
  IoImageOutline,
  IoLinkOutline,
  IoVideocamOutline,
} from "react-icons/io5";

import { usePost } from "@/hooks/usePost";
import type { LinkedInUser, LinkedInVisibility, MediaType } from "@/types/api";

interface PostFormProps {
  user: LinkedInUser;
}

const PostForm: React.FC<PostFormProps> = ({ user }: PostFormProps) => {
  const { isPosting, postSuccess, postError, uploadProgress, submitPost } =
    usePost();

  const [postText, setPostText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<LinkedInVisibility>("PUBLIC");
  const [postType, setPostType] = useState<MediaType>("TEXT");

  // Article post fields
  const [articleUrl, setArticleUrl] = useState("");
  const [articleTitle, setArticleTitle] = useState("");
  const [articleDescription, setArticleDescription] = useState("");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type based on post type
      if (postType === "IMAGE" && !file.type.startsWith("image/")) {
        alert("Please select a valid image file for image posts");
        return;
      }
      if (postType === "VIDEO" && !file.type.startsWith("video/")) {
        alert("Please select a valid video file for video posts");
        return;
      }

      // Check file size limits
      const maxSize =
        postType === "IMAGE" ? 20 * 1024 * 1024 : 100 * 1024 * 1024; // 20MB for images, 100MB for videos
      if (file.size > maxSize) {
        alert(
          `File size exceeds limit (${postType === "IMAGE" ? "20MB" : "100MB"})`,
        );
        return;
      }

      // Clean up previous preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      // Create new preview URL
      const newPreviewUrl = URL.createObjectURL(file);
      setSelectedFile(file);
      setPreviewUrl(newPreviewUrl);
    }
  };

  const handleRemoveFile = () => {
    // Clean up preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl(null);
    // Reset file input
    const fileInput = document.getElementById("file-input") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handlePostTypeChange = (newType: MediaType) => {
    setPostType(newType);

    // Clear file if switching to incompatible type
    if (selectedFile) {
      if (newType === "IMAGE" && !selectedFile.type.startsWith("image/")) {
        handleRemoveFile();
      }
      if (newType === "VIDEO" && !selectedFile.type.startsWith("video/")) {
        handleRemoveFile();
      }
      if (newType === "TEXT" || newType === "ARTICLE") {
        handleRemoveFile();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation based on post type
    if (postType === "TEXT" && !postText.trim()) {
      alert("Please enter some text for your post");
      return;
    }

    if (postType === "ARTICLE") {
      if (!postText.trim()) {
        alert("Please enter text for your article post");
        return;
      }
      if (!articleUrl.trim()) {
        alert("Please enter the article URL");
        return;
      }
      if (!articleTitle.trim()) {
        alert("Please enter the article title");
        return;
      }
    }

    if ((postType === "IMAGE" || postType === "VIDEO") && !selectedFile) {
      alert(`Please select a ${postType.toLowerCase()} file`);
      return;
    }

    try {
      // Prepare article data if needed
      const articleData =
        postType === "ARTICLE"
          ? {
              url: articleUrl,
              title: articleTitle,
              description: articleDescription || undefined,
            }
          : undefined;

      await submitPost(
        postText,
        selectedFile,
        visibility,
        postType,
        articleData,
      );

      // Clear form on success
      setPostText("");
      setArticleUrl("");
      setArticleTitle("");
      setArticleDescription("");

      // Clean up preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setSelectedFile(null);
      setPreviewUrl(null);

      // Reset file input
      const fileInput = document.getElementById(
        "file-input",
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  const getFileAcceptTypes = () => {
    switch (postType) {
      case "IMAGE":
        return "image/*";
      case "VIDEO":
        return "video/*";
      default:
        return "";
    }
  };

  const getPlaceholderText = () => {
    switch (postType) {
      case "TEXT":
        return `Share your thoughts with your LinkedIn network, ${user.firstName}...`;
      case "ARTICLE":
        return `Share your thoughts about this article, ${user.firstName}...`;
      case "IMAGE":
        return `What's the story behind this image, ${user.firstName}?`;
      case "VIDEO":
        return `Tell us about this video, ${user.firstName}...`;
      default:
        return `What's on your mind, ${user.firstName}?`;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success Message */}
      {postSuccess && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-center font-medium text-green-700">
            ✅ Post shared successfully on LinkedIn!
          </p>
        </div>
      )}

      {/* Error Message */}
      {postError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-center font-medium text-red-700">❌ {postError}</p>
        </div>
      )}

      {/* Post Type Selection */}
      <div>
        <label className="mb-3 block text-sm font-medium text-gray-700">
          Post Type
        </label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button
            type="button"
            onClick={() => handlePostTypeChange("TEXT")}
            className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 transition-colors ${
              postType === "TEXT"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
            }`}
          >
            <IoDocumentTextOutline size={24} className="mb-2" />
            <span className="text-sm font-medium">Text</span>
          </button>

          <button
            type="button"
            onClick={() => handlePostTypeChange("ARTICLE")}
            className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 transition-colors ${
              postType === "ARTICLE"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
            }`}
          >
            <IoLinkOutline size={24} className="mb-2" />
            <span className="text-sm font-medium">Article</span>
          </button>

          <button
            type="button"
            onClick={() => handlePostTypeChange("IMAGE")}
            className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 transition-colors ${
              postType === "IMAGE"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
            }`}
          >
            <IoImageOutline size={24} className="mb-2" />
            <span className="text-sm font-medium">Image</span>
          </button>

          <button
            type="button"
            onClick={() => handlePostTypeChange("VIDEO")}
            className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 transition-colors ${
              postType === "VIDEO"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
            }`}
          >
            <IoVideocamOutline size={24} className="mb-2" />
            <span className="text-sm font-medium">Video</span>
          </button>
        </div>
      </div>

      {/* Article Fields - Show only for article posts */}
      {postType === "ARTICLE" && (
        <div className="space-y-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h3 className="text-sm font-medium text-blue-900">Article Details</h3>

          <div>
            <label
              htmlFor="article-url"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Article URL *
            </label>
            <input
              id="article-url"
              type="url"
              value={articleUrl}
              onChange={(e) => setArticleUrl(e.target.value)}
              placeholder="https://example.com/article"
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              disabled={isPosting}
              required
            />
          </div>

          <div>
            <label
              htmlFor="article-title"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Article Title *
            </label>
            <input
              id="article-title"
              type="text"
              value={articleTitle}
              onChange={(e) => setArticleTitle(e.target.value)}
              placeholder="Enter the article title"
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              disabled={isPosting}
              required
            />
          </div>

          <div>
            <label
              htmlFor="article-description"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Article Description
            </label>
            <textarea
              id="article-description"
              value={articleDescription}
              onChange={(e) => setArticleDescription(e.target.value)}
              placeholder="Brief description of the article (optional)"
              className="h-20 w-full resize-none rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              disabled={isPosting}
            />
          </div>
        </div>
      )}

      {/* Post Text Area */}
      <div>
        <label
          htmlFor="post-text"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          {postType === "ARTICLE"
            ? "Your thoughts about this article"
            : "What's on your mind?"}
          {postType !== "TEXT" && (
            <span className="text-gray-500"> (Optional)</span>
          )}
        </label>
        <textarea
          id="post-text"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder={getPlaceholderText()}
          className="h-32 w-full resize-none rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
          maxLength={3000}
          disabled={isPosting}
        />
        <div className="mt-1 text-right text-sm text-gray-500">
          {postText.length}/3000 characters
        </div>
      </div>

      {/* Visibility Selection */}
      <div>
        <label
          htmlFor="visibility"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Post Visibility
        </label>
        <select
          id="visibility"
          value={visibility}
          onChange={(e) => setVisibility(e.target.value as LinkedInVisibility)}
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
          disabled={isPosting}
        >
          <option value="PUBLIC">🌍 Public - Anyone can see this post</option>
          <option value="CONNECTIONS">
            👥 Connections Only - Only your connections can see this
          </option>
          <option value="LOGGED_IN_MEMBERS">
            🔒 LinkedIn Members - Only logged-in LinkedIn members
          </option>
        </select>
      </div>

      {/* File Upload Section - Show only for image/video posts */}
      {(postType === "IMAGE" || postType === "VIDEO") && (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Upload {postType === "IMAGE" ? "Image" : "Video"} *
          </label>

          {selectedFile ? (
            <div className="space-y-4 rounded-lg border border-gray-300 p-4">
              {/* Media Preview */}
              {previewUrl && (
                <div className="relative">
                  {selectedFile.type.startsWith("image/") ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-[200px] w-full rounded-lg bg-gray-50 object-contain"
                    />
                  ) : (
                    <video
                      src={previewUrl}
                      controls
                      className="max-h-[200px] w-full rounded-lg bg-gray-50"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              )}

              {/* File Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {selectedFile.type.startsWith("image/") ? (
                    <IoImageOutline className="text-blue-600" size={24} />
                  ) : (
                    <IoVideocamOutline className="text-blue-600" size={24} />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-sm font-medium text-red-600 hover:text-red-800"
                  disabled={isPosting}
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="relative rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-gray-400">
              <input
                id="file-input"
                type="file"
                accept={getFileAcceptTypes()}
                onChange={handleFileSelect}
                className="sr-only"
                disabled={isPosting}
              />
              <label htmlFor="file-input" className="block cursor-pointer">
                <div className="space-y-2">
                  <div className="flex justify-center">
                    {postType === "IMAGE" ? (
                      <IoImageOutline className="text-gray-400" size={48} />
                    ) : (
                      <IoVideocamOutline className="text-gray-400" size={48} />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Click to upload{" "}
                    {postType === "IMAGE" ? "an image" : "a video"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {postType === "IMAGE"
                      ? "Supports: JPG, PNG, GIF, BMP, TIFF, WebP (Max 20MB)"
                      : "Supports: MP4, MOV, AVI, WMV, FLV, WebM (Max 100MB)"}
                  </p>
                </div>
              </label>
            </div>
          )}
        </div>
      )}

      {/* Upload Progress */}
      {isPosting && uploadProgress > 0 && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {uploadProgress < 25
                ? "Preparing..."
                : uploadProgress < 50
                  ? "Uploading..."
                  : uploadProgress < 75
                    ? "Processing..."
                    : uploadProgress < 90
                      ? "Creating post..."
                      : "Almost done..."}
            </span>
            <span className="text-sm text-blue-700">{uploadProgress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-blue-200">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={
            isPosting ||
            (postType === "TEXT" && !postText.trim()) ||
            (postType === "ARTICLE" &&
              (!postText.trim() ||
                !articleUrl.trim() ||
                !articleTitle.trim())) ||
            ((postType === "IMAGE" || postType === "VIDEO") && !selectedFile)
          }
          className="flex items-center space-x-2 rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isPosting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              <span>
                {uploadProgress > 0 ? "Uploading..." : "Posting to LinkedIn..."}
              </span>
            </>
          ) : (
            <span>Post to LinkedIn</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default PostForm;
