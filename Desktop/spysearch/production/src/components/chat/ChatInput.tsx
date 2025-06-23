
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  onSendMessage: (message: string, files: File[], isDeepResearch: boolean) => void;
  searchMode?: boolean;
  onSearchModeChange?: (enabled: boolean) => void;
  onLoginRequired?: () => void;
}

export const ChatInput = ({ 
  input, 
  setInput, 
  isLoading, 
  onSendMessage,
  searchMode = true,
  onSearchModeChange,
  onLoginRequired
}: ChatInputProps) => {
  const [internalSearchMode, setInternalSearchMode] = useState(true);
  const { isAuthenticated, loginWithGoogle, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentSearchMode = onSearchModeChange ? searchMode : internalSearchMode;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading || authLoading) return;
    
    if (!isAuthenticated) {
      try {
        await loginWithGoogle();
      } catch (error) {
        console.error('Login failed:', error);
        toast({
          title: "Sign In Required",
          description: "Please sign in with Google to start searching!",
          variant: "destructive",
        });
      }
      return;
    }
    
    onSendMessage(trimmedInput, [], false);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleSearchMode = () => {
    const newMode = !currentSearchMode;
    if (onSearchModeChange) {
      onSearchModeChange(newMode);
    } else {
      setInternalSearchMode(newMode);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // Prevent extremely long inputs that could cause issues
    if (value.length <= 10000) {
      setInput(value);
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${isMobile ? 'p-4' : 'p-6'}`}>
      <div className="relative bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm">
        
        <div className={`flex items-start gap-3 ${isMobile ? 'p-3' : 'p-4'}`}>
          <button
            onClick={toggleSearchMode}
            disabled={isLoading || authLoading}
            className={`${isMobile ? 'p-2 mt-1' : 'p-2.5 mt-1'} rounded-lg transition-colors flex-shrink-0 ${
              currentSearchMode 
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            } ${(isLoading || authLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={currentSearchMode ? "Web Search: ON" : "Web Search: OFF"}
          >
            <Globe className={`${isMobile ? 'h-4 w-4' : 'h-4 w-4'}`} />
          </button>

          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Message SPY SEARCH..."
              disabled={isLoading || authLoading}
              className={`w-full min-h-[40px] max-h-[200px] ${isMobile ? 'text-sm px-3 py-2' : 'text-base px-4 py-3'} bg-transparent text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 border-0 outline-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0 overflow-y-auto`}
              rows={1}
            />
            
            {isLoading && (
              <div className="absolute right-3 top-3 flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading || authLoading}
            className={`${isMobile ? 'h-8 w-8 mt-1' : 'h-9 w-9 mt-1'} rounded-lg transition-colors flex items-center justify-center flex-shrink-0 ${
              input.trim() && !isLoading && !authLoading
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
            title={isAuthenticated ? "Send Message" : "Sign in to send"}
          >
            <Send className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
