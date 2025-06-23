
import { useRef } from "react";
import { Bot, Loader2 } from "lucide-react";
import { MessageItem } from "./MessageItem";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  isDeepResearch: boolean;
  streamingMessageId?: string | null;
}

export const MessageList = ({ messages, isLoading, isDeepResearch, streamingMessageId }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Remove auto-scrolling behavior - let parent component handle scrolling

  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <MessageItem 
          key={message.id} 
          message={message}
          isStreaming={streamingMessageId === message.id}
        />
      ))}
      
      {isLoading && !streamingMessageId && (
        <div className="flex gap-4 justify-start">
          <div className="flex-shrink-0 mt-1">
            <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
              <Bot className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
          <div className="flex-1 max-w-3xl">
            <div className="bg-transparent">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Thinking...
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};
