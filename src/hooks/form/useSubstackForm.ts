import { useState } from "react";

import { substackApi } from "@/services/api";
import type { CreateSubstackPostRequest, SubstackUser } from "@/types/api";

import { useToast } from "../toast/useToast";

type PostType = "post" | "newsletter";

interface UseSubstackFormProps {
  user: SubstackUser;
}

export const useSubstackForm = ({ user }: UseSubstackFormProps) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState<PostType>("post");
  const [isDraft, setIsDraft] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  const { showError, showSuccess } = useToast();

  const validatePost = (): boolean => {
    if (!title.trim()) {
      showError("Please enter a title for your post");
      return false;
    }

    if (!content.trim()) {
      showError("Please enter content for your post");
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setTitle("");
    setSubtitle("");
    setContent("");
    setPostType("post");
    setIsDraft(true);
    setPostSuccess(false);
    setPostError(null);
  };

  const submitPost = async () => {
    if (!validatePost()) return;

    setIsPosting(true);
    setPostSuccess(false);
    setPostError(null);

    try {
      const postData: CreateSubstackPostRequest = {
        title: title.trim(),
        content: content.trim(),
        subtitle: subtitle.trim() || undefined,
        isDraft,
      };

      const sessionId = localStorage.getItem("substackSessionId");
      if (!sessionId) {
        const errorMsg =
          "Substack session not found. Please reconnect to Substack.";
        setPostError(errorMsg);
        showError(errorMsg);
        return;
      }

      const response = await substackApi.createPost(sessionId, postData);

      if (response.success) {
        const action = isDraft ? "saved as draft" : "published";
        const successMsg = `Post ${action} successfully on Substack!`;
        setPostSuccess(true);
        showSuccess(successMsg);
        resetForm();
      } else {
        const errorMsg = response.message || "Failed to create post";
        setPostError(errorMsg);
        showError(errorMsg);
      }
    } catch (error) {
      console.error("Error creating Substack post:", error);
      const errorMsg =
        error instanceof Error ? error.message : "Failed to create post";
      setPostError(errorMsg);
      showError(errorMsg);
    } finally {
      setIsPosting(false);
    }
  };

  const getPlaceholderText = (): string => {
    switch (postType) {
      case "post":
        return `Share your thoughts with your Substack readers, ${user.name || "there"}...`;
      case "newsletter":
        return `What's in your newsletter today, ${user.name || "there"}?`;
      default:
        return `What's on your mind, ${user.name || "there"}?`;
    }
  };

  return {
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
    resetForm,
    getPlaceholderText,
  };
};
