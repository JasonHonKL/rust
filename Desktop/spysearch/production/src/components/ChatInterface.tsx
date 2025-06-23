import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageList } from "./chat/MessageList";
import { ChatInput } from "./chat/ChatInput";
import { WelcomeSection } from "./chat/WelcomeSection";
import { LoadingSpinner } from "./chat/LoadingSpinner";
import { useStreamingChat } from "@/hooks/useStreamingChat";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  responseTime?: number;
}

interface ChatInterfaceProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  currentConversationId?: string | null;
  onConversationCreated?: (title: string) => void;
  refreshConversations?: () => Promise<void>;
}

export const ChatInterface = ({ 
  messages, 
  setMessages, 
  isLoading, 
  setIsLoading,
  currentConversationId,
  onConversationCreated,
  refreshConversations
}: ChatInterfaceProps) => {
  const [input, setInput] = useState("");
  const [searchMode, setSearchMode] = useState(true);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const isMobile = useIsMobile();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { sendStreamingMessage, streamingMessageId } = useStreamingChat({
    messages,
    setMessages,
    setIsLoading,
    currentConversationTitle: currentConversationId,
    onConversationCreated,
    refreshConversations
  });

  // Only scroll when user sends a message or when shouldScrollToBottom is true
  useEffect(() => {
    if (shouldScrollToBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setShouldScrollToBottom(false);
    }
  }, [shouldScrollToBottom, messages]);

  const handleSendMessage = async (messageContent: string, files: File[], isDeepResearch: boolean) => {
    // Set flag to scroll after user sends message
    setShouldScrollToBottom(true);
    await sendStreamingMessage(messageContent, files, isDeepResearch);
  };

  const handlePromptClick = async (promptText: string) => {
    if (isAuthenticated && !isLoading) {
      // Set flag to scroll after user clicks prompt
      setShouldScrollToBottom(true);
      await sendStreamingMessage(promptText, [], false);
    }
  };

  if (authLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      <ScrollArea className="flex-1 overflow-auto" ref={scrollAreaRef}>
        <div className={`max-w-6xl mx-auto px-4 md:px-8 ${isMobile ? 'pb-32' : 'py-8'}`}>
          {messages.length === 0 ? (
            <WelcomeSection 
              onPromptClick={handlePromptClick}
              isAuthenticated={isAuthenticated}
            />
          ) : (
            <div className={isMobile ? 'pt-6' : 'pt-8'}>
              <MessageList 
                messages={messages} 
                isLoading={isLoading} 
                isDeepResearch={false}
                streamingMessageId={streamingMessageId}
              />
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </ScrollArea>

      <div className={`${isMobile ? 'fixed bottom-0 left-0 right-0 z-50' : ''} border-t border-gray-50 dark:border-gray-800 bg-white dark:bg-gray-900 ${isMobile ? 'shadow-xl' : ''}`}>
        <div className={`max-w-6xl mx-auto ${isMobile ? 'px-4' : 'px-8'}`}>
          <ChatInput
            input={input}
            setInput={setInput}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            searchMode={searchMode}
            onSearchModeChange={setSearchMode}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
