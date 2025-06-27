import React, { useState } from "react";

import { X_POST_TYPE_OPTIONS } from "@/consts/xForm";
import { useToast } from "@/hooks/toast/useToast";
import { xApi } from "@/services/api";
import type { CreateTweetRequest, XUser } from "@/types/api";
import type { TweetType } from "@/types/xForm";

import Toast from "./Toast";
import CharacterCounter from "./common/CharacterCounter";
import FormField from "./common/FormField";
import FormSubmitButton from "./common/FormSubmitButton";
import PostTypeItem from "./form/PostTypeItem";

interface XFormProps {
  user: XUser;
}

const XForm: React.FC<XFormProps> = ({ user }) => {
  const [tweetText, setTweetText] = useState("");
  const [tweetType, setTweetType] = useState<TweetType>("text");
  const [isPosting, setIsPosting] = useState(false);

  const { toast, showError, showSuccess, hideToast } = useToast();

  const handleTweetTypeChange = (type: TweetType) => {
    setTweetType(type);
  };

  const validateTweet = () => {
    if (!tweetText.trim()) {
      showError("Please enter some text for your tweet");
      return false;
    }

    if (tweetText.length > 280) {
      showError("Tweet must be 280 characters or less");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateTweet()) return;

    setIsPosting(true);

    try {
      const tweetData: CreateTweetRequest = {
        text: tweetText.trim(),
      };

      const response = await xApi.createTweet(tweetData);

      if (response.success) {
        showSuccess("Tweet posted successfully!");
        setTweetText("");
        setTweetType("text");
      } else {
        showError(response.message || "Failed to post tweet");
      }
    } catch (error) {
      console.error("Error posting tweet:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to post tweet";
      showError(errorMessage);
    } finally {
      setIsPosting(false);
    }
  };

  const characterCount = tweetText.length;
  const isOverLimit = characterCount > 280;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField label="Tweet Type" htmlFor="tweet-type">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {X_POST_TYPE_OPTIONS.map((option) => (
              <PostTypeItem
                key={option.id}
                value={option.value as TweetType}
                selectedValue={tweetType}
                handlePostTypeChange={() =>
                  handleTweetTypeChange(option.value as TweetType)
                }
                icon={option.icon}
                label={option.label}
              />
            ))}
          </div>
        </FormField>

        <FormField label="What's happening?" htmlFor="tweet-text" required>
          <textarea
            id="tweet-text"
            value={tweetText}
            onChange={(e) => setTweetText(e.target.value)}
            placeholder={`What's happening, ${user.name}?`}
            className={`w-full rounded-lg border p-3 focus:ring-2 focus:outline-none ${
              isOverLimit
                ? "border-red-300 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            rows={4}
            disabled={isPosting}
            maxLength={280}
          />
          <CharacterCounter
            currentCount={characterCount}
            maxCount={280}
            warningThreshold={20}
            userInfo={`Posting as @${user.username}`}
            className="mt-2"
          />
        </FormField>

        {/* Submit Button */}
        <div className="flex items-center justify-end">
          <FormSubmitButton
            isLoading={isPosting}
            disabled={isOverLimit}
            loadingText="Posting..."
          >
            Post Tweet
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

export default XForm;
