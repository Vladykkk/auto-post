import React from "react";

import type { MediaType } from "@/types/api";

import PostTypeItem from "../form/PostTypeItem";

interface PostTypeSelectorProps {
  selectedPostType: MediaType;
  onPostTypeChange: (type: MediaType) => void;
  options: Array<{
    id: number;
    value: MediaType;
    icon: React.ReactElement;
    label: string;
  }>;
  disabled?: boolean;
  disabledTypes?: MediaType[];
  className?: string;
  label?: string;
  showWarning?: boolean;
  warningMessage?: string;
}

const PostTypeSelector: React.FC<PostTypeSelectorProps> = ({
  selectedPostType,
  onPostTypeChange,
  options,
  disabled = false,
  disabledTypes = [],
  className = "",
  label = "Post Type",
  showWarning = false,
  warningMessage,
}) => {
  return (
    <div className={className}>
      <div className="mb-3 flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {showWarning && (
          <span className="rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-600">
            📝 Text-only
          </span>
        )}
      </div>

      {showWarning && warningMessage && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> {warningMessage}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {options.map((option) => (
          <PostTypeItem
            key={option.id}
            value={option.value}
            selectedValue={selectedPostType}
            handlePostTypeChange={(type) => onPostTypeChange(type as MediaType)}
            icon={option.icon}
            label={option.label}
            disabled={disabled || disabledTypes.includes(option.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default PostTypeSelector;
