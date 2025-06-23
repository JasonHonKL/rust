
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTokenValidation } from '@/services/tokenService';
import { StreamingService } from '@/services/streamingService';
import { MessageService } from '@/services/messageService';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  responseTime?: number;
}

interface UseStreamingChatProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  currentConversationTitle?: string | null;
  onConversationCreated?: (title: string) => void;
  refreshConversations?: () => Promise<void>;
}

export const useStreamingChat = ({
  messages,
  setMessages,
  setIsLoading,
  currentConversationTitle,
  onConversationCreated,
  refreshConversations
}: UseStreamingChatProps) => {
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const { toast } = useToast();
  const { validateTokens } = useTokenValidation();
  const streamingService = new StreamingService();
  const messageService = new MessageService();

  const sendStreamingMessage = useCallback(async (
    messageContent: string,
    files: File[] = [],
    isDeepResearch: boolean = false
  ) => {
    // Validate input
    if (!messageContent.trim()) {
      console.warn('Empty message content provided');
      return;
    }

    // Validate tokens first
    const hasValidTokens = await validateTokens(isDeepResearch);
    if (!hasValidTokens) return;

    const startTime = Date.now();
    const userMessage = messageService.createUserMessage(messageContent.trim());
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage = messageService.createAssistantMessage(assistantMessageId);

    // Add messages to state
    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setIsLoading(true);
    setStreamingMessageId(assistantMessageId);

    try {
      console.log('Sending streaming request:', { messageContent, isDeepResearch, filesCount: files.length });
      
      const response = await streamingService.sendStreamingRequest(
        [...messages, userMessage],
        files,
        isDeepResearch,
        messageContent.trim()
      );

      if (isDeepResearch) {
        const reportContent = await streamingService.processReportResponse(response);
        const responseTime = Date.now() - startTime;
        
        setMessages(prev =>
          messageService.updateMessageContent(prev, assistantMessageId, reportContent, responseTime)
        );
      } else {
        await streamingService.processStreamingResponse(response, (content) => {
          setMessages(prev =>
            messageService.updateMessageContent(prev, assistantMessageId, content)
          );
        });

        const responseTime = Date.now() - startTime;
        setMessages(prev => {
          const currentMessage = prev.find(m => m.id === assistantMessageId);
          return messageService.updateMessageContent(
            prev, 
            assistantMessageId, 
            currentMessage?.content || '', 
            responseTime
          );
        });
      }

    } catch (error) {
      console.error('Streaming error:', error);
      
      setMessages(prev => messageService.updateMessagesWithError(prev, assistantMessageId));

      const errorMessage = error instanceof Error ? error.message : "Failed to send message. Please check your connection and try again.";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setStreamingMessageId(null);
    }
  }, [messages, setMessages, setIsLoading, validateTokens, toast, streamingService, messageService]);

  return { sendStreamingMessage, streamingMessageId };
};
