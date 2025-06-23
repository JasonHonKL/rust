
import { User, Bot } from "lucide-react";

interface MessageAvatarProps {
  type: 'user' | 'assistant';
}

export const MessageAvatar = ({ type }: MessageAvatarProps) => {
  if (type === 'assistant') {
    return (
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center">
          <Bot className="h-4 w-4 text-white dark:text-gray-900" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0">
      <div className="w-8 h-8 bg-gray-700 dark:bg-gray-600 rounded-full flex items-center justify-center">
        <User className="h-4 w-4 text-white" />
      </div>
    </div>
  );
};
