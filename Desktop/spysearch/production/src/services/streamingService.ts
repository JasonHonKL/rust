
import { API_CONFIG } from '@/config/api';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export class StreamingService {
  async sendStreamingRequest(
    messages: Message[],
    files: File[],
    isDeepResearch: boolean,
    messageContent: string
  ): Promise<Response> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }

    const conversationMessages = messages.map(msg => ({
      role: msg.type === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    const endpoint = isDeepResearch 
      ? API_CONFIG.ENDPOINTS.REPORT
      : API_CONFIG.ENDPOINTS.STREAM_COMPLETION;

    // If there are files, use multipart/form-data with StreamRequest as JSON
    if (files && files.length > 0) {
      const formData = new FormData();
      
      // Create the StreamRequest object and add it as JSON
      const streamRequest = {
        query: messageContent,
        messages: JSON.stringify(conversationMessages),
        api: isDeepResearch ? 'report' : 'stream'
      };
      
      // Add the request object as JSON string
      formData.append('request', JSON.stringify(streamRequest));
      
      // Add files
      files.forEach(file => {
        formData.append('files', file);
      });

      return await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type header - let browser set it with boundary
        },
        body: formData,
      });
    } else {
      // If no files, send as direct JSON matching StreamRequest model
      const streamRequest = {
        query: messageContent,
        messages: JSON.stringify(conversationMessages),
        api: isDeepResearch ? 'report' : 'stream'
      };

      return await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(streamRequest),
      });
    }
  }

  async processStreamingResponse(
    response: Response,
    onChunk: (content: string) => void
  ): Promise<void> {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let accumulatedContent = '';

    if (reader) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          accumulatedContent += chunk;
          onChunk(accumulatedContent);
        }
      } finally {
        reader.releaseLock();
      }
    }
  }

  async processReportResponse(response: Response): Promise<string> {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.report || 'No report generated';
  }
}
