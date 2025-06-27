import { useState } from "react";

import {
  LINKEDIN_POST_TYPE_OPTIONS,
  LINKEDIN_VISIBILITY_OPTIONS,
} from "@/consts/linkedinForm";
import { useFileUpload } from "@/hooks/form/useFileUpload";
import { usePost } from "@/hooks/form/usePost";
import { useToast } from "@/hooks/toast/useToast";
import type { LinkedInUser, LinkedInVisibility, MediaType } from "@/types/api";

import Toast from "./Toast";
import CharacterCounter from "./common/CharacterCounter";
import FileUpload from "./common/FileUpload";
import FormField from "./common/FormField";
import FormStatus from "./common/FormStatus";
import FormSubmitButton from "./common/FormSubmitButton";
import PostTypeSelector from "./common/PostTypeSelector";

interface LinkedinFormProps {
  user: LinkedInUser;
}

const LinkedinForm: React.FC<LinkedinFormProps> = ({
  user,
}: LinkedinFormProps) => {
  const { isPosting, postSuccess, postError, uploadProgress, submitPost } =
    usePost();
  const { toast, showError, hideToast } = useToast();

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

  const [postText, setPostText] = useState("");
  const [visibility, setVisibility] = useState<LinkedInVisibility>("PUBLIC");
  const [postType, setPostType] = useState<MediaType>("TEXT");

  const handlePostTypeChange = (newType: MediaType) => {
    setPostType(newType);
    handleFilePostTypeChange(newType, selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (postType === "TEXT" && !postText.trim()) {
      showError("Please enter some text for your post");
      return;
    }

    if ((postType === "IMAGE" || postType === "VIDEO") && !selectedFile) {
      showError(`Please select a ${postType.toLowerCase()} file`);
      return;
    }

    try {
      await submitPost(postText, selectedFile, visibility, postType);

      setPostText("");
      resetFileState();
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  const getPlaceholderText = () => {
    switch (postType) {
      case "TEXT":
        return `Share your thoughts with your LinkedIn network, ${user.firstName}...`;
      case "IMAGE":
        return `What's the story behind this image, ${user.firstName}?`;
      case "VIDEO":
        return `Tell us about this video, ${user.firstName}...`;
      default:
        return `What's on your mind, ${user.firstName}?`;
    }
  };

  const transformedOptions = LINKEDIN_POST_TYPE_OPTIONS.map((option) => ({
    ...option,
    value: option.value as MediaType,
  }));

  const characterCount = postText.length;
  const maxCharacters = 3000;
  const isOverLimit = characterCount > maxCharacters;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {postSuccess && (
          <FormStatus
            type="success"
            message="Post shared successfully on LinkedIn!"
          />
        )}

        {postError && <FormStatus type="error" message={postError} />}

        <PostTypeSelector
          selectedPostType={postType}
          onPostTypeChange={handlePostTypeChange}
          options={transformedOptions}
          disabled={isPosting}
        />

        <FormField
          label="What's on your mind?"
          htmlFor="post-text"
          required={postType === "TEXT"}
        >
          <textarea
            id="post-text"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder={getPlaceholderText()}
            className={`w-full rounded-lg border p-3 focus:ring-2 focus:outline-none ${
              isOverLimit
                ? "border-red-300 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            rows={4}
            disabled={isPosting}
            maxLength={maxCharacters}
          />
          <CharacterCounter
            currentCount={characterCount}
            maxCount={maxCharacters}
            userInfo={`Posting as ${user.firstName} ${user.lastName}`}
            className="mt-2"
          />
        </FormField>

        <FileUpload
          postType={postType}
          selectedFile={selectedFile}
          previewUrl={previewUrl}
          onFileSelect={(e) => handleFileSelect(e, postType)}
          onRemoveFile={() => handleRemoveFile("file-input")}
          getFileAcceptTypes={() => getFileAcceptTypes(postType)}
          disabled={isPosting}
          inputId="file-input"
        />

        <FormField label="Post Visibility" htmlFor="visibility">
          <select
            id="visibility"
            value={visibility}
            onChange={(e) =>
              setVisibility(e.target.value as LinkedInVisibility)
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
        </FormField>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="flex items-center gap-2">
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

          <FormSubmitButton
            isLoading={isPosting}
            disabled={isOverLimit}
            loadingText="Posting..."
          >
            Share on LinkedIn
          </FormSubmitButton>
        </div>
      </form>

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

export default LinkedinForm;
