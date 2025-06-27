import React from "react";

import {
  SUBSTACK_POST_TYPE_OPTIONS,
  SUBSTACK_PUBLISH_OPTIONS,
} from "@/consts/substackForm";
import { useSubstackForm } from "@/hooks/form/useSubstackForm";
import { useToast } from "@/hooks/toast/useToast";
import type { SubstackUser } from "@/types/api";

import Toast from "./Toast";
import CharacterCounter from "./common/CharacterCounter";
import FormField from "./common/FormField";
import FormStatus from "./common/FormStatus";
import FormSubmitButton from "./common/FormSubmitButton";

type PostType = "post" | "newsletter";

interface SubstackFormProps {
  user: SubstackUser;
}

const SubstackForm: React.FC<SubstackFormProps> = ({ user }) => {
  const {
    title,
    subtitle,
    content,
    postType,
    isDraft,
    isPosting,
    postSuccess,
    postError,
    setTitle,
    setSubtitle,
    setContent,
    setPostType,
    setIsDraft,
    submitPost,
    getPlaceholderText,
  } = useSubstackForm({ user });

  const { toast, hideToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitPost();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {postSuccess && (
          <FormStatus
            type="success"
            message={`Post ${isDraft ? "saved as draft" : "published"} successfully on Substack!`}
          />
        )}

        {postError && <FormStatus type="error" message={postError} />}

        <FormField label="Post Type" htmlFor="post-type">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SUBSTACK_POST_TYPE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setPostType(option.value as PostType)}
                disabled={isPosting}
                className={`flex items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all disabled:opacity-50 ${
                  postType === option.value
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {option.icon}
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </FormField>

        <FormField label="Title" htmlFor="post-title" required>
          <input
            id="post-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your post title..."
            className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
            disabled={isPosting}
            maxLength={200}
            required
          />
          <CharacterCounter
            currentCount={title.length}
            maxCount={200}
            className="mt-2"
          />
        </FormField>

        <FormField label="Subtitle" htmlFor="post-subtitle">
          <input
            id="post-subtitle"
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Enter a subtitle (optional)..."
            className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
            disabled={isPosting}
            maxLength={150}
          />
          <CharacterCounter
            currentCount={subtitle.length}
            maxCount={150}
            className="mt-2"
          />
        </FormField>

        <FormField label="Content" htmlFor="post-content" required>
          <textarea
            id="post-content"
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={getPlaceholderText()}
            className="w-full resize-none rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
            disabled={isPosting}
            required
          />
          <CharacterCounter
            currentCount={content.length}
            maxCount={10000}
            userInfo={`Posting as ${user.name || user.email}`}
            className="mt-2"
          />
        </FormField>

        <FormField label="Publish Options" htmlFor="publish-options">
          <div className="grid grid-cols-2 gap-3">
            {SUBSTACK_PUBLISH_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setIsDraft(option.value)}
                disabled={isPosting}
                className={`flex items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all disabled:opacity-50 ${
                  isDraft === option.value
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </FormField>

        <div className="flex items-center justify-end">
          <FormSubmitButton isLoading={isPosting} loadingText="Posting...">
            {isDraft ? "Save as Draft" : "Publish Post"}
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

export default SubstackForm;
