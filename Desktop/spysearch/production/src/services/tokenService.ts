
import { apiClient } from '@/services/apiClient';
import { useToast } from '@/hooks/use-toast';

export const useTokenValidation = () => {
  const { toast } = useToast();

  const validateTokens = async (isDeepResearch: boolean = false): Promise<boolean> => {
    try {
      const tokenStatus = await apiClient.getTokenStatus();
      const tokensNeeded = isDeepResearch ? 5 : 1;
      
      if (tokenStatus.daily_tokens_remaining < tokensNeeded) {
        toast({
          title: "Insufficient Tokens",
          description: `You need ${tokensNeeded} tokens for this search. You have ${tokenStatus.daily_tokens_remaining} remaining.`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    } catch (error) {
      console.error('Failed to check token status:', error);
      toast({
        title: "Error",
        description: "Failed to check token status. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return { validateTokens };
};
