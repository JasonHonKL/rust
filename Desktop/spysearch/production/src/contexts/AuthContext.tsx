import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/services/apiClient';
import { API_CONFIG } from '@/config/api';

interface User {
  email: string;
  name: string;
  picture?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

// Create the context with undefined as default
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Auth Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Update apiClient token whenever token changes
  useEffect(() => {
    apiClient.setToken(token);
  }, [token]);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('AuthContext: Checking authentication status...');
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user_data');
        
        // Check if we're in the middle of an auth callback
        const isAuthCallback = window.location.pathname.includes('/auth/callback') || 
                               window.location.search.includes('token=') ||
                               window.location.search.includes('login=success');
        
        if (storedToken && storedUser) {
          console.log('AuthContext: Found stored token and user data, attempting to restore session...');
          
          try {
            // Parse stored user data first
            const userData = JSON.parse(storedUser);
            
            // Set the token in apiClient
            apiClient.setToken(storedToken);
            
            // Try to verify the token, but don't be too aggressive about clearing it
            const response = await fetch(API_CONFIG.ENDPOINTS.VERIFY, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${storedToken}`,
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            });
            
            if (response.ok) {
              const data = await response.json();
              console.log('AuthContext: Token verified successfully, user data:', data);
              setToken(storedToken);
              setUser(data.user || userData); // Use verified user data, fallback to stored
              setIsAuthenticated(true);
            } else if (response.status === 401) {
              // Only clear on explicit unauthorized response
              console.log('AuthContext: Token expired or invalid (401), clearing session');
              localStorage.removeItem('auth_token');
              localStorage.removeItem('user_data');
              apiClient.setToken(null);
            } else {
              // For other errors (network issues, 500, etc.), keep the session
              console.log('AuthContext: Token verification failed with status:', response.status, 'but keeping session');
              setToken(storedToken);
              setUser(userData);
              setIsAuthenticated(true);
            }
          } catch (verifyError) {
            console.error('AuthContext: Token verification error:', verifyError);
            // Don't clear tokens on network errors - keep the session
            console.log('AuthContext: Keeping session despite verification error (might be network issue)');
            try {
              const userData = JSON.parse(storedUser);
              setToken(storedToken);
              setUser(userData);
              setIsAuthenticated(true);
            } catch (parseError) {
              console.error('AuthContext: Could not parse stored user data, clearing session');
              localStorage.removeItem('auth_token');
              localStorage.removeItem('user_data');
              apiClient.setToken(null);
            }
          }
        } else if (storedToken && !storedUser) {
          // If we're in an auth callback, don't clear the token yet - give AuthCallback time to complete
          if (isAuthCallback) {
            console.log('AuthContext: Found token without user data during auth callback, waiting for callback to complete...');
            // Keep the token temporarily during auth flow
            setToken(storedToken);
            apiClient.setToken(storedToken);
          } else {
            // Token without user data outside of auth flow is suspicious, clear it
            console.log('AuthContext: Found token but no user data outside auth flow, clearing...');
            localStorage.removeItem('auth_token');
            apiClient.setToken(null);
          }
        } else if (!storedToken && storedUser) {
          // User data without token, clear it
          console.log('AuthContext: Found user data but no token, clearing...');
          localStorage.removeItem('user_data');
        }
      } catch (error) {
        console.error('AuthContext: Auth check failed:', error);
        // Only clear on critical errors, not network issues
        if (error instanceof SyntaxError) {
          // JSON parsing error, clear corrupted data
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          apiClient.setToken(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loginWithGoogle = async (): Promise<void> => {
    try {
      console.log('AuthContext: Starting Google login...');
      // Get Google auth URL
      const response = await fetch(API_CONFIG.ENDPOINTS.GOOGLE_LOGIN, {
        method: 'GET',
        headers: API_CONFIG.DEFAULT_HEADERS,
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get auth URL: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('AuthContext: Redirecting to Google OAuth:', data.auth_url);
      
      // Redirect to Google OAuth - your backend will handle the callback
      window.location.href = data.auth_url;
    } catch (error) {
      console.error('AuthContext: Google login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('AuthContext: Logging out...');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    apiClient.setToken(null);
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    token,
    loginWithGoogle,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
