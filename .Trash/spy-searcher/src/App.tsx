import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Settings, 
  MessageCircle, 
  Trash2, 
  User, 
  Bot, 
  ChevronLeft,
  ChevronRight,
  Brain,
  Search,
  Database,
  Globe,
  Cpu,
  CheckCircle2,
  Circle
} from 'lucide-react';

// Main App Component
function App() {
  const [messages, setMessages] = useState([]);
  const [chatSessions, setChatSessions] = useState([
    { id: 1, name: 'General Chat', messages: [] },
  ]);
  const [currentSessionId, setCurrentSessionId] = useState(1);
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(false);
  const [isConfigCollapsed, setIsConfigCollapsed] = useState(false);
  const [config, setConfig] = useState({
    // Agent Workflow Settings
    selectedAgents: {
      planner: true,
      rag: false,
      browserSearch: false,
      codeExecutor: false,
      imageAnalysis: false,
    },
    agentWorkflow: 'sequential', // sequential, parallel, conditional
    // LLM Settings
    selectedLLM: 'gpt-4-turbo',
    temperature: 0.7,
    maxTokens: 2048,
    // UI Settings
    theme: 'system',
    fontSize: 'medium',
    autoScroll: true,
    showTimestamps: true,
  });

  const currentSession = chatSessions.find(session => session.id === currentSessionId);

  const updateCurrentSession = (newMessages) => {
    setChatSessions(prev => prev.map(session => 
      session.id === currentSessionId 
        ? { ...session, messages: newMessages }
        : session
    ));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left: ChatHistory */}
      <div className={`transition-all duration-300 ease-in-out bg-white border-r border-gray-200 ${
        isHistoryCollapsed ? 'w-12' : 'w-80'
      }`}>
        <ChatHistory 
          chatSessions={chatSessions}
          setChatSessions={setChatSessions}
          currentSessionId={currentSessionId}
          setCurrentSessionId={setCurrentSessionId}
          isCollapsed={isHistoryCollapsed}
          setIsCollapsed={setIsHistoryCollapsed}
        />
      </div>
      
      {/* Middle: Chat */}
      <div className="flex-grow bg-white">
        <Chat 
          messages={currentSession?.messages || []}
          updateMessages={updateCurrentSession}
          config={config}
        />
      </div>
      
      {/* Right: Config */}
      <div className={`transition-all duration-300 ease-in-out bg-white border-l border-gray-200 ${
        isConfigCollapsed ? 'w-12' : 'w-80'
      }`}>
        <Config 
          config={config} 
          setConfig={setConfig}
          isCollapsed={isConfigCollapsed}
          setIsCollapsed={setIsConfigCollapsed}
        />
      </div>
    </div>
  );
}

// Chat Component
function Chat({ messages, updateMessages, config }) {
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (config.autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, config.autoScroll]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };

    const newMessages = [...messages, userMessage];
    updateMessages(newMessages);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response with agent workflow
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        text: generateAIResponse(inputMessage, config),
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
        agents: getActiveAgents(config.selectedAgents),
      };
      updateMessages([...newMessages, aiMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 2000);
  };

  const getActiveAgents = (selectedAgents) => {
    return Object.entries(selectedAgents)
      .filter(([_, isActive]) => isActive)
      .map(([agent, _]) => agent);
  };

  const generateAIResponse = (userInput, config) => {
    const activeAgents = getActiveAgents(config.selectedAgents);
    const agentContext = activeAgents.length > 0 
      ? `[Using: ${activeAgents.join(', ')}] ` 
      : '';
    
    const responses = [
      `${agentContext}That's an interesting perspective! Let me analyze this from multiple angles...`,
      `${agentContext}I've processed your request using ${config.selectedLLM}. Here's my comprehensive response:`,
      `${agentContext}Based on my analysis, I believe this requires a multi-step approach...`,
      `${agentContext}Great question! I'm drawing from various knowledge sources to provide you with the best answer.`,
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getFontSizeClass = () => {
    switch (config.fontSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      default: return 'text-base';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Bot className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">AI Assistant</h1>
              <p className="text-sm text-gray-500">
                {config.selectedLLM} • {Object.values(config.selectedAgents).filter(Boolean).length} agents active
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {Object.entries(config.selectedAgents).map(([agent, isActive]) => 
              isActive && (
                <div key={agent} className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                  {agent === 'planner' && <Brain size={12} />}
                  {agent === 'rag' && <Database size={12} />}
                  {agent === 'browserSearch' && <Search size={12} />}
                  {agent === 'codeExecutor' && <Cpu size={12} />}
                  {agent === 'imageAnalysis' && <Globe size={12} />}
                  <span className="capitalize">{agent}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="text-center mt-20">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="text-blue-500" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start a conversation</h3>
            <p className="text-gray-500">Ask me anything, and I'll use the configured agents to help you!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div className={`flex gap-3 max-w-2xl ${
                message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'user' 
                    ? 'bg-blue-500' 
                    : 'bg-gray-100'
                }`}>
                  {message.sender === 'user' ? 
                    <User className="text-white" size={16} /> : 
                    <Bot className="text-gray-600" size={16} />
                  }
                </div>
                <div className={`rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className={getFontSizeClass()}>{message.text}</p>
                  {config.showTimestamps && (
                    <p className={`text-xs mt-2 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp}
                    </p>
                  )}
                  {message.agents && message.agents.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {message.agents.map(agent => (
                        <span key={agent} className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                          {agent}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Bot className="text-gray-600" size={16} />
            </div>
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full border border-gray-300 rounded-2xl py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="1"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="w-12 h-12 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full transition-all duration-200 flex items-center justify-center"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ChatHistory Component
function ChatHistory({ chatSessions, setChatSessions, currentSessionId, setCurrentSessionId, isCollapsed, setIsCollapsed }) {
  const [isCreating, setIsCreating] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');

  const createNewSession = () => {
    if (newSessionName.trim()) {
      const newSession = {
        id: Date.now(),
        name: newSessionName.trim(),
        messages: [],
      };
      setChatSessions(prev => [...prev, newSession]);
      setCurrentSessionId(newSession.id);
      setNewSessionName('');
      setIsCreating(false);
    }
  };

  const deleteSession = (sessionId) => {
    if (chatSessions.length > 1) {
      setChatSessions(prev => prev.filter(session => session.id !== sessionId));
      if (currentSessionId === sessionId) {
        setCurrentSessionId(chatSessions.find(s => s.id !== sessionId)?.id || chatSessions[0].id);
      }
    }
  };

  if (isCollapsed) {
    return (
      <div className="h-full flex flex-col items-center py-4">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight size={20} />
        </button>
        <div className="flex-1 flex flex-col gap-2 mt-4">
          {chatSessions.map((session) => (
            <button
              key={session.id}
              onClick={() => setCurrentSessionId(session.id)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                currentSessionId === session.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {session.name.charAt(0).toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={() => setIsCreating(true)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-medium transition-colors"
        >
          New Conversation
        </button>
      </div>

      {/* New Session Creation */}
      {isCreating && (
        <div className="px-4 pb-4">
          <div className="bg-gray-50 rounded-xl p-3">
            <input
              type="text"
              value={newSessionName}
              onChange={(e) => setNewSessionName(e.target.value)}
              placeholder="Conversation name..."
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && createNewSession()}
              autoFocus
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={createNewSession}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewSessionName('');
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Session List */}
      <div className="flex-1 overflow-y-auto px-4">
        <div className="space-y-2">
          {chatSessions.map((session) => (
            <div
              key={session.id}
              className={`group p-3 rounded-xl cursor-pointer transition-all ${
                currentSessionId === session.id
                  ? 'bg-blue-50 border-2 border-blue-200'
                  : 'hover:bg-gray-50 border-2 border-transparent'
              }`}
              onClick={() => setCurrentSessionId(session.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{session.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {session.messages.length} messages
                    </span>
                    {session.messages.length > 0 && (
                      <span className="text-xs text-gray-400">•</span>
                    )}
                  </div>
                  {session.messages.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {session.messages[session.messages.length - 1].text}
                    </p>
                  )}
                </div>
                {chatSessions.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(session.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Config Component  
function Config({ config, setConfig, isCollapsed, setIsCollapsed }) {
  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const updateAgentConfig = (agent, value) => {
    setConfig(prev => ({
      ...prev,
      selectedAgents: {
        ...prev.selectedAgents,
        [agent]: value
      }
    }));
  };

  const agents = [
    { key: 'planner', name: 'Planner', icon: Brain, description: 'Plans and organizes complex tasks' },
    { key: 'rag', name: 'RAG Search', icon: Database, description: 'Retrieves relevant information from knowledge base' },
    { key: 'browserSearch', name: 'Web Search', icon: Search, description: 'Searches the internet for current information' },
    { key: 'codeExecutor', name: 'Code Executor', icon: Cpu, description: 'Executes and validates code snippets' },
    { key: 'imageAnalysis', name: 'Image Analysis', icon: Globe, description: 'Analyzes and describes images' },
  ];

  const llmOptions = [
    { value: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI' },
    { value: 'gpt-4', name: 'GPT-4', provider: 'OpenAI' },
    { value: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic' },
    { value: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic' },
    { value: 'gemini-pro', name: 'Gemini Pro', provider: 'Google' },
  ];

  if (isCollapsed) {
    return (
      <div className="h-full flex flex-col items-center py-4">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="mt-4">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
            <Settings className="text-gray-600" size={16} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Agent Workflow Section */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-3">Agent Workflow</h3>
          <div className="space-y-3">
            {agents.map((agent) => {
              const IconComponent = agent.icon;
              return (
                <div key={agent.key} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <button
                    onClick={() => updateAgentConfig(agent.key, !config.selectedAgents[agent.key])}
                    className="mt-0.5"
                  >
                    {config.selectedAgents[agent.key] ? (
                      <CheckCircle2 className="text-blue-500" size={20} />
                    ) : (
                      <Circle className="text-gray-400" size={20} />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <IconComponent className="text-gray-600" size={16} />
                      <span className="font-medium text-gray-900">{agent.name}</span>
                    </div>
                    <p className="text-sm text-gray-600">{agent.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workflow Mode
            </label>
            <select
              value={config.agentWorkflow}
              onChange={(e) => updateConfig('agentWorkflow', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="sequential">Sequential (one after another)</option>
              <option value="parallel">Parallel (simultaneously)</option>
              <option value="conditional">Conditional (based on context)</option>
            </select>
          </div>
        </div>

        {/* LLM Selection */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-3">Language Model</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model Selection
              </label>
              <select
                value={config.selectedLLM}
                onChange={(e) => updateConfig('selectedLLM', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {llmOptions.map((llm) => (
                  <option key={llm.value} value={llm.value}>
                    {llm.name} ({llm.provider})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature: {config.temperature}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.temperature}
                onChange={(e) => updateConfig('temperature', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Focused</span>
                <span>Creative</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Tokens: {config.maxTokens}
              </label>
              <input
                type="range"
                min="256"
                max="4096"
                step="256"
                value={config.maxTokens}
                onChange={(e) => updateConfig('maxTokens', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Short</span>
                <span>Long</span>
              </div>
            </div>
          </div>
        </div>

        {/* UI Preferences */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-3">Interface</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <select
                value={config.theme}
                onChange={(e) => updateConfig('theme', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Size
              </label>
              <select
                value={config.fontSize}
                onChange={(e) => updateConfig('fontSize', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.autoScroll}
                  onChange={(e) => updateConfig('autoScroll', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Auto-scroll to new messages</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.showTimestamps}
                  onChange={(e) => updateConfig('showTimestamps', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Show message timestamps</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;