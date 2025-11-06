/**
 * API service for the Teleprompter webview
 */
import { terminal } from 'virtual:terminal';

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
};

export default api;