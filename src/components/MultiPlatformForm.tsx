import React, { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { SiSubstack } from "react-icons/si";

import { LINKEDIN_VISIBILITY_OPTIONS } from "@/consts/linkedinForm";
import {
  MULTI_PLATFORM_POST_TYPE_OPTIONS,
  SINGLE_PLATFORM_POST_TYPE_OPTIONS,
} from "@/consts/multiPlatform";
import { useFileUpload } from "@/hooks/form/useFileUpload";
import { useMultiPlatformPost } from "@/hooks/form/useMultiPlatformPost";
import { useToast } from "@/hooks/toast/useToast";
import type {
  LinkedInUser,
  LinkedInVisibility,
  MediaType,
  MultiPlatformPostRequest,
  Platform,
  SubstackUser,
  XUser,
} from "@/types/api";

import Toast from "./Toast";
import FileUpload from "./common/FileUpload";
import PostTypeSelector from "./common/PostTypeSelector";
import PlatformCheckboxList from "./multi-platform/PlatformCheckboxList";

interface MultiPlatformFormProps {
  linkedinUser?: LinkedInUser;
  xUser?: XUser;
  substackUser?: SubstackUser;
}

const MultiPlatformForm: React.FC<MultiPlatformFormProps> = ({
  linkedinUser,
  xUser,
  substackUser,
}) => {
  const {
    isPosting,
    postError,
    uploadProgress,
    currentPlatforms,
    results,
    submitMultiPlatformPost,
    cancelPosting,
  } = useMultiPlatformPost();

  const { toast, showError, showSuccess, hideToast } = useToast();

  const {
    selectedFile,
    previewUrl,
    handleFileSelect,
    handleRemoveFile,
    handlePostTypeChange: handleFilePostTypeChange,
    getFileAcceptTypes,
    resetFileState,
  } = useFileUpload({
    onError: showError,
  });

  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [postText, setPostText] = useState("");
  const [postType, setPostType] = useState<MediaType>("TEXT");

  const [linkedinVisibility, setLinkedinVisibility] =
    useState<LinkedInVisibility>("PUBLIC");
  const [substackTitle, setSubstackTitle] = useState("");
  const [substackSubtitle, setSubstackSubtitle] = useState("");

  const [substackIsDraft, setSubstackIsDraft] = useState(false);

  const availablePlatforms = [
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: <FaLinkedin className="text-blue-600" />,
      connected: !!linkedinUser,
      user: linkedinUser,
    },
    {
      id: "x",
      name: "X (Twitter)",
      icon: <FaXTwitter className="text-black" />,
      connected: !!xUser,
      user: xUser,
    },
    {
      id: "substack",
      name: "Substack",
      icon: <SiSubstack className="text-orange-600" />,
      connected: !!substackUser && substackUser.status === "logged_in",
      user: substackUser,
    },
  ];

  const connectedPlatforms = availablePlatforms.filter((p) => p.connected);
  const isMultiplePlatforms = selectedPlatforms.length > 1;
  const hasXSelected = selectedPlatforms.includes("x");

  const handlePlatformToggle = (platformId: Platform) => {
    setSelectedPlatforms((prev) => {
      const newPlatforms = prev.includes(platformId)
        ? prev.filter((p) => p !== platformId)
        : [...prev, platformId];

      if (newPlatforms.length > 1 || newPlatforms.includes("x")) {
        setPostType("TEXT");
        handleRemoveFile("multi-file-input");
      }

      return newPlatforms;
    });
  };

  const handleSelectAll = () => {
    const allConnected = connectedPlatforms.map((p) => p.id as Platform);
    const newPlatforms =
      selectedPlatforms.length === allConnected.length ? [] : allConnected;

    if (newPlatforms.length > 1 || newPlatforms.includes("x")) {
      setPostType("TEXT");
      handleRemoveFile("multi-file-input");
    }

    setSelectedPlatforms(newPlatforms);
  };

  const handlePostTypeChange = (newType: MediaType) => {
    if ((isMultiplePlatforms || hasXSelected) && newType !== "TEXT") {
      if (hasXSelected && !isMultiplePlatforms) {
        showError("Media uploads are not supported for X (Twitter) posts.");
      } else {
        showError(
          "Media uploads are not supported when posting to multiple platforms. X (Twitter) doesn't support media in our current implementation.",
        );
      }
      return;
    }

    setPostType(newType);
    handleFilePostTypeChange(newType, selectedFile);
  };

  const validateForm = (): string | null => {
    if (selectedPlatforms.length === 0) {
      return "Please select at least one platform";
    }

    if (!postText.trim()) {
      return "Please enter some text for your post";
    }

    if ((postType === "IMAGE" || postType === "VIDEO") && !selectedFile) {
      return `Please select a ${postType.toLowerCase()} file`;
    }

    if (selectedPlatforms.includes("substack")) {
      if (!substackTitle.trim()) {
        return "Please enter a title for your Substack post";
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      showError(validationError);
      return;
    }

    const request: MultiPlatformPostRequest = {
      platforms: selectedPlatforms,
      content: {
        text: postText,
        media: selectedFile || undefined,
        mediaType: postType,
      },
      platformSpecific: {
        linkedin: selectedPlatforms.includes("linkedin")
          ? { visibility: linkedinVisibility }
          : undefined,
        substack: selectedPlatforms.includes("substack")
          ? {
              title: substackTitle,
              subtitle: substackSubtitle || undefined,
              isDraft: substackIsDraft,
            }
          : undefined,
      },
    };

    try {
      const response = await submitMultiPlatformPost(request);

      if (response.success) {
        showSuccess(
          `Successfully posted to ${response.results.filter((r) => r.success).length}/${response.results.length} platforms!`,
        );

        setPostText("");
        setSubstackTitle("");
        setSubstackSubtitle("");
        resetFileState();
      } else {
        const failedPlatforms = response.results
          .filter((r) => !r.success)
          .map((r) => r.platform);
        showError(`Failed to post to: ${failedPlatforms.join(", ")}`);
      }
    } catch (error) {
      console.error("Error submitting multi-platform post:", error);
      showError("An unexpected error occurred while posting");
    }
  };

  const getPostTypeOptions = () => {
    return isMultiplePlatforms || hasXSelected
      ? MULTI_PLATFORM_POST_TYPE_OPTIONS
      : SINGLE_PLATFORM_POST_TYPE_OPTIONS;
  };

  const getPlaceholderText = () => {
    if (isMultiplePlatforms) {
      return "Share your thoughts across multiple platforms...";
    }

    const platformName = selectedPlatforms[0];
    switch (platformName) {
      case "linkedin":
        return `Share your professional thoughts, ${linkedinUser?.firstName}...`;
      case "x":
        return `What's happening, ${xUser?.name}?`;
      case "substack":
        return "Write your newsletter content...";
      default:
        return "What's on your mind?";
    }
  };

  if (connectedPlatforms.length === 0) {
    return (
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 text-center">
        <h3 className="mb-2 text-lg font-medium text-blue-900">
          No Connected Platforms
        </h3>
        <p className="text-blue-700">
          Connect your social media accounts in Settings to use multi-platform
          posting.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          🚀 Multi-Platform Post
        </h2>
        <p className="mb-6 text-sm text-gray-600">
          Post to multiple platforms simultaneously. Select the platforms you
          want to post to and configure platform-specific settings.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <PlatformCheckboxList
            selectedPlatforms={selectedPlatforms}
            onPlatformToggle={handlePlatformToggle}
            onSelectAll={handleSelectAll}
            linkedinUser={linkedinUser}
            xUser={xUser}
            substackUser={substackUser}
            disabled={isPosting}
          />

          {selectedPlatforms.length > 0 && (
            <>
              {(isMultiplePlatforms || hasXSelected) && (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <p className="text-sm font-medium text-yellow-800">
                    📝 Text-only{" "}
                    {isMultiplePlatforms ? "(Multi-platform)" : "(X/Twitter)"}
                  </p>
                  <p className="mt-1 text-xs text-yellow-700">
                    {hasXSelected && !isMultiplePlatforms
                      ? "Media uploads are not supported for X (Twitter) posts."
                      : "Media uploads are not supported when posting to multiple platforms."}
                  </p>
                </div>
              )}

              {selectedPlatforms.includes("substack") && (
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <FaInfoCircle className="text-gray-700" />
                  <p className="text-sm text-gray-700">
                    With Substack option, request will take a longer time to
                    complete.
                  </p>
                </div>
              )}

              <PostTypeSelector
                selectedPostType={postType}
                onPostTypeChange={handlePostTypeChange}
                options={getPostTypeOptions()}
                disabled={isPosting}
              />

              <div>
                <label
                  htmlFor="post-text"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Post Content *
                </label>
                <textarea
                  id="post-text"
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder={getPlaceholderText()}
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  rows={4}
                  disabled={isPosting}
                  required
                />
              </div>

              {!isMultiplePlatforms && !hasXSelected && (
                <FileUpload
                  postType={postType}
                  selectedFile={selectedFile}
                  previewUrl={previewUrl}
                  onFileSelect={(e) => handleFileSelect(e, postType)}
                  onRemoveFile={() => handleRemoveFile("multi-file-input")}
                  getFileAcceptTypes={() => getFileAcceptTypes(postType)}
                  disabled={isPosting}
                  inputId="multi-file-input"
                />
              )}

              {selectedPlatforms.includes("linkedin") && (
                <div>
                  <label
                    htmlFor="linkedin-visibility"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    LinkedIn Visibility
                  </label>
                  <select
                    id="linkedin-visibility"
                    value={linkedinVisibility}
                    onChange={(e) =>
                      setLinkedinVisibility(
                        e.target.value as LinkedInVisibility,
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    disabled={isPosting}
                  >
                    {LINKEDIN_VISIBILITY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedPlatforms.includes("substack") && (
                <div className="space-y-4 rounded-lg border border-gray-200 p-4">
                  <h3 className="font-medium text-gray-900">
                    Substack Settings
                  </h3>

                  <div>
                    <label
                      htmlFor="substack-title"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Title *
                    </label>
                    <input
                      id="substack-title"
                      type="text"
                      value={substackTitle}
                      onChange={(e) => setSubstackTitle(e.target.value)}
                      placeholder="Enter your post title"
                      className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      disabled={isPosting}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="substack-subtitle"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Subtitle
                    </label>
                    <input
                      id="substack-subtitle"
                      type="text"
                      value={substackSubtitle}
                      onChange={(e) => setSubstackSubtitle(e.target.value)}
                      placeholder="Enter a subtitle (optional)"
                      className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      disabled={isPosting}
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      id="substack-draft"
                      type="checkbox"
                      checked={substackIsDraft}
                      onChange={(e) => setSubstackIsDraft(e.target.checked)}
                      className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      disabled={isPosting}
                    />
                    <label
                      htmlFor="substack-draft"
                      className="text-sm text-gray-700"
                    >
                      Save as draft
                    </label>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {isPosting && currentPlatforms.length > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                      <span>Posting to: {currentPlatforms.join(", ")}...</span>
                    </div>
                  )}
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-2 w-32 rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <span>{uploadProgress}%</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {isPosting && (
                    <button
                      type="button"
                      onClick={cancelPosting}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={isPosting || selectedPlatforms.length === 0}
                    className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isPosting ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Posting...
                      </div>
                    ) : (
                      `Post to ${selectedPlatforms.length} Platform${selectedPlatforms.length !== 1 ? "s" : ""}`
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </form>

        {results.length > 0 && (
          <div className="mt-6 space-y-3">
            <h3 className="text-sm font-medium text-gray-700">
              Posting Results:
            </h3>
            {results.map((result) => (
              <div
                key={result.platform}
                className={`rounded-lg border p-3 ${
                  result.success
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {result.platform === "linkedin" && (
                      <FaLinkedin className="text-blue-600" />
                    )}
                    {result.platform === "x" && (
                      <FaXTwitter className="text-black" />
                    )}
                    {result.platform === "substack" && (
                      <SiSubstack className="text-orange-600" />
                    )}
                    <span className="font-medium capitalize">
                      {result.platform}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      result.success ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {result.success ? "✅ Success" : "❌ Failed"}
                  </span>
                </div>
                {result.error && (
                  <p className="mt-1 text-sm text-red-600">{result.error}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {postError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-center font-medium text-red-700">
              ❌ {postError}
            </p>
          </div>
        )}
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={
            toast.type === "success" || toast.type === "error"
              ? toast.type
              : "error"
          }
          onClose={hideToast}
        />
      )}
    </div>
  );
};

export default MultiPlatformForm;
