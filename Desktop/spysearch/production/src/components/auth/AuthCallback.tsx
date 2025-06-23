
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { API_CONFIG } from "@/config/api";

export const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('AuthCallback: Processing authentication callback...');
        console.log('AuthCallback: Current URL:', window.location.href);
        
        // Get the raw URL search params
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const loginStatus = urlParams.get('login');
        const errorMessage = urlParams.get('message');

        console.log('AuthCallback: URL params:', { 
          token: token ? `${token.substring(0, 20)}...` : null, 
          loginStatus, 
          errorMessage 
        });

        // Clear URL parameters immediately to prevent other components from processing them
        window.history.replaceState({}, document.title, '/auth/callback');

        if (loginStatus === 'error' || errorMessage) {
          console.error('OAuth error:', errorMessage);
          toast({
            title: "Authentication Failed",
            description: errorMessage || "There was an error during authentication. Please try again.",
            variant: "destructive",
          });
          navigate('/', { replace: true });
          return;
        }

        if (loginStatus === 'success' && token) {
          try {
            console.log('AuthCallback: Storing token and verifying...');
            
            // Store the JWT token immediately
            localStorage.setItem('auth_token', token);
            
            // Verify the token and get user info
            const response = await fetch(API_CONFIG.ENDPOINTS.VERIFY, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });

            console.log('AuthCallback: Verify response status:', response.status);

            if (response.ok) {
              const data = await response.json();
              console.log('AuthCallback: Token verified successfully');
              localStorage.setItem('user_data', JSON.stringify(data.user));
              
              toast({
                title: "Login Successful",
                description: "You have been logged in successfully.",
              });

              // Navigate to home page and force a reload to ensure AuthContext picks up the new state
              navigate('/', { replace: true });
              // Small delay to ensure navigation completes before reload
              setTimeout(() => {
                window.location.reload();
              }, 100);
              
            } else {
              console.error('AuthCallback: Token verification failed with status:', response.status);
              const errorText = await response.text();
              console.error('AuthCallback: Error response:', errorText);
              
              // Clear invalid token
              localStorage.removeItem('auth_token');
              localStorage.removeItem('user_data');
              
              toast({
                title: "Authentication Failed",
                description: "Failed to verify authentication. Please try again.",
                variant: "destructive",
              });
              navigate('/', { replace: true });
            }
            
          } catch (error) {
            console.error('AuthCallback: Token verification error:', error);
            // Clear tokens on error
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            
            toast({
              title: "Authentication Failed",
              description: "Failed to verify authentication. Please try again.",
              variant: "destructive",
            });
            navigate('/', { replace: true });
          }
        } else {
          console.log('AuthCallback: No token or success status, redirecting to home');
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('AuthCallback: URL parsing error:', error);
        toast({
          title: "Authentication Failed",
          description: "There was an error processing the authentication response.",
          variant: "destructive",
        });
        navigate('/', { replace: true });
      }
    };

    handleCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-sm text-muted-foreground">Processing authentication...</p>
      </div>
    </div>
  );
};
