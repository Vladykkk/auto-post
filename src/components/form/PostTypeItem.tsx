import type { MediaType } from "@/types/api";
import type { TweetType } from "@/types/xForm";

interface PostTypeItemProps {
  value: MediaType | TweetType;
  selectedValue?: MediaType | TweetType;
  handlePostTypeChange: (type: MediaType | TweetType) => void;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
}

const PostTypeItem = ({
  value,
  selectedValue,
  handlePostTypeChange,
  icon,
  label,
  disabled = false,
}: PostTypeItemProps) => {
  return (
    <button
      type="button"
      onClick={() => !disabled && handlePostTypeChange(value)}
      disabled={disabled}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 p-4 transition-colors ${
        selectedValue === value
          ? "border-blue-500 bg-blue-50 text-blue-700"
          : disabled
            ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 opacity-50"
            : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

export default PostTypeItem;
