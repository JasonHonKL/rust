
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChatInterface } from "@/components/ChatInterface";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { SimplifiedSettingsPage } from "@/components/layout/SimplifiedSettingsPage";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Handle authentication tokens that come directly to home page (but not from callback routes)
  useEffect(() => {
    const handleAuthToken = async () => {
      try {
        console.log('Index: Checking for auth token in URL...');
        
        // Don't process auth tokens if we're coming from an auth callback route
        const isFromAuthCallback = document.referrer.includes('/auth/callback') || 
                                  document.referrer.includes('/auth/google/callback');
        
        if (isFromAuthCallback) {
          console.log('Index: Skipping auth token processing - coming from auth callback');
          return;
        }
        
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const loginStatus = urlParams.get('login');
        const errorMessage = urlParams.get('message');

        if (token || loginStatus || errorMessage) {
          console.log('Index: Found auth parameters, clearing URL...', { 
            hasToken: !!token, 
            loginStatus, 
            errorMessage 
          });

          // Clear URL parameters immediately to prevent conflicts with AuthContext
          window.history.replaceState({}, document.title, window.location.pathname);

          if (loginStatus === 'error' || errorMessage) {
            console.error('OAuth error:', errorMessage);
            toast({
              title: "Authentication Failed",
              description: errorMessage || "There was an error during authentication. Please try again.",
              variant: "destructive",
            });
            return;
          }

          if (loginStatus === 'success' && token) {
            console.log('Index: Storing token for AuthContext to pick up...');
            // Store token and let AuthContext handle the verification
            localStorage.setItem('auth_token', token);
            
            // Force AuthContext to re-check authentication
            window.location.reload();
          }
        }
      } catch (error) {
        console.error('Index: Auth token processing error:', error);
        toast({
          title: "Authentication Failed",
          description: "There was an error processing the authentication response.",
          variant: "destructive",
        });
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    handleAuthToken();
  }, [navigate, toast]);

  const handleNewConversation = () => {
    setMessages([]);
    setIsLoading(false);
  };

  if (showSettings) {
    return (
      <SimplifiedSettingsPage
        onBack={() => setShowSettings(false)}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col w-full bg-background">
      <TopNavigation
        onNewConversation={handleNewConversation}
        onSettingsClick={() => setShowSettings(true)}
      />

      <div className="flex-1 overflow-hidden">
        <ChatInterface 
          messages={messages}
          setMessages={setMessages}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          currentConversationId={null}
          onConversationCreated={() => {}}
          refreshConversations={async () => {}}
        />
      </div>
    </div>
  );
};

export default Index;
