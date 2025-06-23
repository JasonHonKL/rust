
interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  responseTime?: number;
}

export class MessageService {
  createUserMessage(content: string): Message {
    return {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    };
  }

  createAssistantMessage(id: string): Message {
    return {
      id,
      type: 'assistant',
      content: '',
      timestamp: new Date(),
    };
  }

  updateMessageContent(
    messages: Message[],
    messageId: string,
    content: string,
    responseTime?: number
  ): Message[] {
    return messages.map(msg =>
      msg.id === messageId
        ? { ...msg, content, ...(responseTime && { responseTime }) }
        : msg
    );
  }

  updateMessagesWithError(
    messages: Message[],
    messageId: string
  ): Message[] {
    return messages.map(msg =>
      msg.id === messageId
        ? { ...msg, content: 'Sorry, I encountered an error while processing your request. Please try again.' }
        : msg
    );
  }
}
