
import { Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import { MarkdownComponents } from './MarkdownComponents';
import { LaTeXProcessor } from './LaTeXProcessor';

interface AssistantMessageProps {
  content: string;
  isStreaming?: boolean;
  responseTime?: number;
}

export const AssistantMessage = ({ content, isStreaming, responseTime }: AssistantMessageProps) => {
  const formatResponseTime = (responseTime: number) => {
    return (responseTime / 1000).toFixed(2);
  };

  return (
    <>
      <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-900 dark:prose-p:text-gray-100 prose-p:leading-relaxed prose-p:text-lg prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-semibold prose-code:text-gray-900 dark:prose-code:text-gray-100 prose-pre:bg-gray-200 dark:prose-pre:bg-gray-700 prose-pre:border-gray-300 dark:prose-pre:border-gray-600 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600 prose-blockquote:border-l-4 prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-700 dark:hover:prose-a:text-blue-300">
        <ReactMarkdown 
          components={MarkdownComponents}
          remarkPlugins={[remarkGfm]}
        >
          {LaTeXProcessor.processLatex(content)}
        </ReactMarkdown>
        {isStreaming && (
          <span className="inline-block w-2 h-5 bg-gray-400 animate-pulse ml-1"></span>
        )}
      </div>
      
      {responseTime && !isStreaming && (
        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
          <Clock className="h-3 w-3 text-gray-500" />
          <span className="text-xs text-gray-500">
            {formatResponseTime(responseTime)}s
          </span>
        </div>
      )}
    </>
  );
};
