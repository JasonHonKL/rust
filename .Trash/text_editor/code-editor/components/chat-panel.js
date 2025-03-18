// components/chat-panel.js
import aiService from '../services/ai-service.js';

class ChatPanel {
  constructor(container) {
    this.container = container;
    this.messagesContainer = container.querySelector('#chat-messages');
    this.inputElement = container.querySelector('#chat-input');
    this.sendButton = container.querySelector('#send-chat-btn');
    this.messages = [];
    
    this.initialize();
  }
  
  initialize() {
    // Set up event listeners
    this.sendButton.addEventListener('click', () => this.sendMessage());
    this.inputElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    
    // Subscribe to AI messages
    aiService.onMessage((message) => {
      this.addMessage(message);
    });
    
    // Add welcome message
    this.addMessage({
      id: Date.now(),
      sender: 'AI',
      message: 'Welcome to the Code Editor! I\'m here to help you with coding questions. (This is a placeholder for future AI integration.)',
      timestamp: new Date().toISOString()
    });
  }
  
  async sendMessage() {
    const message = this.inputElement.value.trim();
    if (!message) return;
    
    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      sender: 'User',
      message: message,
      timestamp: new Date().toISOString()
    };
    
    this.addMessage(userMessage);
    
    // Clear input
    this.inputElement.value = '';
    
    // Send to AI service
    await aiService.sendMessage(message);
  }
  
  addMessage(message) {
    this.messages.push(message);
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${message.sender.toLowerCase()}`;
    messageElement.innerHTML = `
      <div class="message-header">
        <span class="message-sender">${message.sender}</span>
        <span class="message-time">${this.formatTime(message.timestamp)}</span>
      </div>
      <div class="message-content">${this.formatMessage(message.message)}</div>
    `;
    
    // Append to container
    this.messagesContainer.appendChild(messageElement);
    
    // Scroll to bottom
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }
  
  formatMessage(message) {
    // Simple formatting - replace newlines with <br>
    return message.replace(/\n/g, '<br>');
  }
  
  formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  }
}

export default ChatPanel;