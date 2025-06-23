
import { PromptSuggestions } from "./PromptSuggestions";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface WelcomeSectionProps {
  onPromptClick: (promptText: string) => void;
  isAuthenticated: boolean;
}

export const WelcomeSection = ({ onPromptClick, isAuthenticated }: WelcomeSectionProps) => {
  const { loginWithGoogle } = useAuth();
  const { toast } = useToast();

  const handlePromptClick = async (promptText: string) => {
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
    onPromptClick(promptText);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 md:px-8">
      {/* Hero section */}
      <div className="text-center mb-8 max-w-4xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal text-gray-900 dark:text-white mb-4">
          SPY SEARCH
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6 font-normal">
          Your intelligent search companion
        </p>
        
        {!isAuthenticated && (
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-gray-900 dark:text-white font-medium">
                Sign in to get started
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Sign in with Google to begin your search journey
            </p>
          </div>
        )}
      </div>

      {/* Prompt suggestions */}
      <PromptSuggestions 
        onPromptClick={handlePromptClick}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
};
