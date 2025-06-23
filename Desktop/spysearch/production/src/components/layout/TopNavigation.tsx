
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface TopNavigationProps {
  onNewConversation: () => void;
  onSettingsClick: () => void;
}

export const TopNavigation = ({ onNewConversation, onSettingsClick }: TopNavigationProps) => {
  const { user, logout, isAuthenticated, loginWithGoogle, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    onNewConversation();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button onClick={handleLogoClick} className="text-xl font-medium text-gray-900 dark:text-white">
              SPY SEARCH
            </button>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <button 
            onClick={handleLogoClick} 
            className="text-xl font-medium text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            SPY SEARCH
          </button>

          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    <img 
                      src={user.picture} 
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="bg-black dark:bg-white text-white dark:text-black text-sm px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                Sign In
              </button>
            )}

            <div className="flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-gray-700">
              <ThemeToggle />
              <button
                onClick={onSettingsClick}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
