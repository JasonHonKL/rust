
import { InlineMath, BlockMath } from 'react-katex';

export class LaTeXProcessor {
  static processLatex(content: string): string {
    if (!content) return content;
    
    // Handle block math first ($$...$$) - more restrictive to avoid conflicts
    content = content.replace(/\$\$\s*([\s\S]*?)\s*\$\$/g, (match, latex) => {
      const trimmedLatex = latex.trim();
      if (trimmedLatex) {
        return `<BLOCK_MATH>${trimmedLatex}</BLOCK_MATH>`;
      }
      return match; // Return original if empty
    });
    
    // Handle inline math ($...$) but be much more careful to avoid currency
    content = content.replace(/(?<!<BLOCK_MATH>.*)\$([^$\n\r]+?)\$(?!.*<\/BLOCK_MATH>)/g, (match, latex) => {
      const trimmedLatex = latex.trim();
      
      // Skip if it looks like currency (starts with digits, contains common currency patterns)
      if (/^[\d,]+(\.\d{2})?$/.test(trimmedLatex)) {
        return match; // Return original - this is currency
      }
      
      // Skip if it contains currency-like patterns
      if (/^\d+[\d,]*(\.\d+)?([KMB])?$/.test(trimmedLatex)) {
        return match; // Return original - this looks like currency/numbers
      }
      
      // Skip if it's a simple number or percentage
      if (/^[\d,]+\.?\d*%?$/.test(trimmedLatex)) {
        return match; // Return original - this is just a number
      }
      
      // Skip if it contains common non-math content
      if (/[A-Za-z]{3,}/.test(trimmedLatex) && !/[\\{}^_]/.test(trimmedLatex)) {
        return match; // Return original - this looks like regular text
      }
      
      // Only process if it looks like actual LaTeX (contains LaTeX symbols, operators, etc.)
      if (trimmedLatex && /[\\{}^_]|[a-zA-Z]+[^a-zA-Z\d\s]|\\[a-zA-Z]+/.test(trimmedLatex)) {
        return `<INLINE_MATH>${trimmedLatex}</INLINE_MATH>`;
      }
      
      return match; // Return original if doesn't look like LaTeX
    });
    
    return content;
  }

  static renderMathContent(content: string) {
    if (!content) return content;
    
    const parts = content.split(/(<BLOCK_MATH>[\s\S]*?<\/BLOCK_MATH>|<INLINE_MATH>[\s\S]*?<\/INLINE_MATH>)/);
    
    return parts.map((part, index) => {
      if (part.startsWith('<BLOCK_MATH>') && part.endsWith('</BLOCK_MATH>')) {
        const latex = part.replace(/<\/?BLOCK_MATH>/g, '');
        try {
          return (
            <div key={index} className="my-8 flex justify-center">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-600 p-8 max-w-full overflow-x-auto rounded-xl shadow-sm">
                <div className="text-2xl flex justify-center items-center">
                  <BlockMath math={latex} />
                </div>
              </div>
            </div>
          );
        } catch (error) {
          console.warn('LaTeX Block Math Error:', error);
          return (
            <div key={index} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-600 p-4 my-4 text-red-700 dark:text-red-300 rounded-lg text-sm">
              <strong>LaTeX Error:</strong> {latex}
            </div>
          );
        }
      } else if (part.startsWith('<INLINE_MATH>') && part.endsWith('</INLINE_MATH>')) {
        const latex = part.replace(/<\/?INLINE_MATH>/g, '');
        try {
          return (
            <span key={index} className="inline-flex items-center mx-1 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-800 dark:to-indigo-800 border border-blue-200 dark:border-blue-600 rounded-md shadow-sm">
              <InlineMath math={latex} />
            </span>
          );
        } catch (error) {
          console.warn('LaTeX Inline Math Error:', error);
          return (
            <span key={index} className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20 px-2 py-1 rounded border border-red-200 dark:border-red-600 text-sm">
              <strong>LaTeX Error:</strong> {latex}
            </span>
          );
        }
      } else {
        return <span key={index}>{part}</span>;
      }
    });
  }
}
