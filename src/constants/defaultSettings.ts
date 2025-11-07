/**
 * Default teleprompter settings
 * This is the single source of truth for default settings used across the application
 */

export interface TeleprompterSettings {
  line_width: string;
  scroll_speed: number;
  number_of_lines: string;
  custom_text: string;
  auto_replay: boolean;
  speech_scroll_enabled: boolean;
  show_estimated_total: boolean;
}

export const DEFAULT_TELEPROMPTER_SETTINGS: TeleprompterSettings = {
  line_width: 'Medium',
  scroll_speed: 120,
  number_of_lines: '4',
  custom_text: '',
  auto_replay: false,
  speech_scroll_enabled: true,
  show_estimated_total: true,
};