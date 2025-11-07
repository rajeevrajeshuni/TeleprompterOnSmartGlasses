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

const api = {
  /**
   * Get user settings
   * @param userId - The user ID to fetch settings for
   */
  async getUserSettings(userId: string): Promise<TeleprompterSettings> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/settings/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
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
   * Start the teleprompter with the given settings
   */
  async startTeleprompter(settings: TeleprompterSettings): Promise<StartTeleprompterResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/start-teleprompter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
};

export default api;