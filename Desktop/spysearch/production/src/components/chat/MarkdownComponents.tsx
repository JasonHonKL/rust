
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LaTeXProcessor } from './LaTeXProcessor';

export const MarkdownComponents = {
  code: ({ node, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : 'text';
    
    if (!className) {
      return (
        <code 
          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm font-mono rounded border"
          {...props}
        >
          {children}
        </code>
      );
    }
    
    return (
      <div className="my-4 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 shadow-sm">
        <div className="bg-gray-800 dark:bg-gray-900 px-4 py-2 text-gray-300 text-sm font-medium flex items-center justify-between">
          <span>{language}</span>
          <button 
            onClick={() => navigator.clipboard.writeText(String(children))}
            className="text-gray-400 hover:text-gray-200 text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            Copy
          </button>
        </div>
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            margin: '0',
            padding: '1rem',
            fontSize: '14px',
            lineHeight: '1.5',
          } as any}
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    );
  },
  table: ({ children }: any) => (
    <div className="my-6 w-full overflow-x-auto">
      <Table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
        {children}
      </Table>
    </div>
  ),
  thead: ({ children }: any) => (
    <TableHeader className="bg-gray-100 dark:bg-gray-800">
      {children}
    </TableHeader>
  ),
  tbody: ({ children }: any) => <TableBody>{children}</TableBody>,
  tr: ({ children }: any) => (
    <TableRow className="border-b border-gray-300 dark:border-gray-600">
      {children}
    </TableRow>
  ),
  th: ({ children }: any) => (
    <TableHead className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">
      {children}
    </TableHead>
  ),
  td: ({ children }: any) => (
    <TableCell className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-800 dark:text-gray-200">
      {children}
    </TableCell>
  ),
  p: ({ children }: any) => {
    const content = String(children);
    if (content.includes('<BLOCK_MATH>') || content.includes('<INLINE_MATH>')) {
      return (
        <div className="mb-5 last:mb-0 leading-relaxed text-lg">
          {LaTeXProcessor.renderMathContent(content)}
        </div>
      );
    }
    return <p className="mb-5 last:mb-0 leading-relaxed text-lg text-gray-900 dark:text-gray-100">{children}</p>;
  },
  ul: ({ children }: any) => <ul className="mb-5 pl-6 space-y-2 text-lg list-disc">{children}</ul>,
  ol: ({ children }: any) => <ol className="mb-5 pl-6 space-y-2 text-lg list-decimal">{children}</ol>,
  li: ({ children }: any) => <li className="leading-relaxed text-lg text-gray-900 dark:text-gray-100">{children}</li>,
  h1: ({ children }: any) => <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{children}</h1>,
  h2: ({ children }: any) => <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">{children}</h2>,
  h3: ({ children }: any) => <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">{children}</h3>,
  strong: ({ children }: any) => <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>,
  em: ({ children }: any) => <em className="italic text-gray-900 dark:text-gray-100">{children}</em>,
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-4 mb-5 text-lg">
      {children}
    </blockquote>
  ),
  a: ({ children, href }: any) => (
    <a href={href} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
};
