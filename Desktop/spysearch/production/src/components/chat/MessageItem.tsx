
import { User, Bot, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from 'react';
import { MessageAvatar } from './MessageAvatar';
import { UserMessage } from './UserMessage';
import { AssistantMessage } from './AssistantMessage';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  responseTime?: number;
}

interface MessageItemProps {
  message: Message;
  isStreaming?: boolean;
}

export const MessageItem = ({ message, isStreaming }: MessageItemProps) => {
  const isUser = message.type === 'user';

  return (
    <div className={`flex gap-4 mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <MessageAvatar type="assistant" />}
      
      <div className={`flex-1 ${isUser ? 'max-w-2xl flex justify-end' : 'max-w-5xl'}`}>
        <div className={`
          rounded-2xl px-6 py-5 max-w-full
          ${isUser 
            ? 'bg-blue-500 text-white ml-12' 
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
          }
        `}>
          {isUser ? (
            <UserMessage content={message.content} />
          ) : (
            <AssistantMessage 
              content={message.content} 
              isStreaming={isStreaming}
              responseTime={message.responseTime}
            />
          )}
        </div>
      </div>

      {isUser && <MessageAvatar type="user" />}
    </div>
  );
};
