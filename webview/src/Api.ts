/**
 * API service for the Teleprompter webview
 */
import { terminal } from 'virtual:terminal';
import type { TeleprompterSettings, StartTeleprompterResponse } from './types/index';

// Use environment variable for API URL, fallback to relative URLs in production
// Check window location to determine if we're in production
const isProduction = window.location.hostname.includes('mentra.glass') ||
                    window.location.hostname.includes('onporter.run');

// Allow override via environment variable
terminal.log('VITE_API_URL from env:', import.meta.env.VITE_API_URL);
terminal.log('isProduction:', isProduction);

const API_BASE_URL = isProduction
  ? 'https://teleprompter-api.mentra.glass'
  : (import.meta.env.VITE_API_URL || '');

terminal.log('API_BASE_URL:', API_BASE_URL);
terminal.log('Is production?', isProduction);
terminal.log('Window hostname:', window.location.hostname);
terminal.log('Vite MODE:', import.meta.env.MODE);

/**
 * Create API client with optional authentication headers
 */
export function createApiClient(getHeaders?: () => HeadersInit) {
  const getAuthHeaders = (): HeadersInit => {
    const baseHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (getHeaders) {
      return { ...baseHeaders, ...getHeaders() };
    }
    
    return baseHeaders;
  };

  return {
    /**
     * Get user settings
     * @param userId - The user ID to fetch settings for
     */
    async getUserSettings(userId: string): Promise<TeleprompterSettings> {
      try {
        const response = await fetch(`${API_BASE_URL}/api/settings/${userId}`, {
          method: 'GET',
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.settings;
      } catch (error) {
        terminal.error('Error fetching user settings:', error);
        throw error;
      }
    },

    /**
     * Save user settings
     * @param userId - The user ID to save settings for
     * @param settings - The settings to save
     */
    async saveUserSettings(userId: string, settings: TeleprompterSettings): Promise<void> {
      try {
        const response = await fetch(`${API_BASE_URL}/api/settings/${userId}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ settings }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        terminal.error('Error saving user settings:', error);
        throw error;
      }
    },

    /**
     * Start the teleprompter with the given settings
     */
    async startTeleprompter(settings: TeleprompterSettings): Promise<StartTeleprompterResponse> {
      try {
        const response = await fetch(`${API_BASE_URL}/api/start-teleprompter`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ settings }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        terminal.error('Error starting teleprompter:', error);
        throw error;
      }
    },

    /**
     * Stop the teleprompter
     */
    async stopTeleprompter(): Promise<{ success: boolean; message: string }> {
      try {
        const response = await fetch(`${API_BASE_URL}/api/stop-teleprompter`, {
          method: 'POST',
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        terminal.error('Error stopping teleprompter:', error);
        throw error;
      }
    },

    /**
     * Reset the teleprompter (restart from beginning)
     */
    async resetTeleprompter(): Promise<{ success: boolean; message: string }> {
      try {
        const response = await fetch(`${API_BASE_URL}/api/reset-teleprompter`, {
          method: 'POST',
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        terminal.error('Error resetting teleprompter:', error);
        throw error;
      }
    },
  };
}

// Default export for backward compatibility (without auth headers)
const api = createApiClient();
export default api;