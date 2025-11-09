/**
 * Default teleprompter settings
 * This is the single source of truth for default settings used across the application
 */

export interface TeleprompterSettings {
  lineWidth: string;
  scrollSpeed: number;
  numberOfLines: string;
  textToRead: string;
  autoReplay: boolean;
  speechScrollEnabled: boolean;
  showEstimatedTotal: boolean;
}

export const DEFAULT_TELEPROMPTER_SETTINGS: TeleprompterSettings = {
  lineWidth: 'Medium',
  scrollSpeed: 120,
  numberOfLines: '4',
  textToRead: '',
  autoReplay: false,
  speechScrollEnabled: true,
  showEstimatedTotal: true,
};