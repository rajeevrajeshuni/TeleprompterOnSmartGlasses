import { useMentraAuth } from '@mentra/react';
import { useCallback } from 'react';

/**
 * Hook to get authenticated API configuration
 */
export function useAuthenticatedApi() {
  const { isAuthenticated, isLoading } = useMentraAuth();
  const frontendToken = 'test-user:584728819e5b3582a5fd57f1fd78e5ddb39178bebd5dc0c8752d6e78e6345987'
  
  const getHeaders = useCallback(() => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (frontendToken) {
      headers['Authorization'] = `Bearer ${frontendToken}`;
    }

    return headers;
  }, [frontendToken]);

  const getAuthQuery = useCallback(() => {
    // For SSE connections that don't support headers
    const query = frontendToken ? `?token=${encodeURIComponent(frontendToken)}` : '';
    return query;
  }, [frontendToken]);

  return {
    getHeaders,
    getAuthQuery,
    isAuthenticated,
    isLoading,
    token: frontendToken,
  };
}