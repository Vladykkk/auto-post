import React from "react";

interface CharacterCounterProps {
  currentCount: number;
  maxCount: number;
  warningThreshold?: number;
  userInfo?: string;
  className?: string;
}

const CharacterCounter: React.FC<CharacterCounterProps> = ({
  currentCount,
  maxCount,
  warningThreshold = 100,
  userInfo,
  className = "",
}) => {
  const charactersRemaining = maxCount - currentCount;
  const isOverLimit = currentCount > maxCount;
  const isWarning =
    charactersRemaining <= warningThreshold && charactersRemaining > 0;
  const progressPercentage = Math.min((currentCount / maxCount) * 100, 100);

  const getTextColor = () => {
    if (isOverLimit) return "text-red-500";
    if (isWarning) return "text-yellow-600";
    return "text-gray-500";
  };

  const getProgressColor = () => {
    if (isOverLimit) return "bg-red-500";
    if (isWarning) return "bg-yellow-500";
    return "bg-blue-500";
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        {userInfo && <div className="text-sm text-gray-500">{userInfo}</div>}
        <div className={`text-sm font-medium ${getTextColor()}`}>
          {charactersRemaining} characters remaining
        </div>
      </div>

      <div className="mt-2 h-1 w-full rounded-full bg-gray-200">
        <div
          className={`h-1 rounded-full transition-all duration-300 ${getProgressColor()}`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default CharacterCounter;
