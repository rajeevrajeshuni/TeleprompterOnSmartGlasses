/**
 * SettingsManager - Encapsulates all settings storage and retrieval operations
 * Currently uses in-memory storage, can be easily extended to use database or file storage
 */

import { DEFAULT_TELEPROMPTER_SETTINGS, type TeleprompterSettings } from '../constants/defaultSettings';

export class SettingsManager {
  // In-memory storage for user settings
  private userSettings: Map<string, TeleprompterSettings>;

  constructor() {
    this.userSettings = new Map();
  }

  /**
   * Get settings for a specific user
   * Returns user's saved settings or default settings if none exist
   */
  getUserSettings(userId: string): TeleprompterSettings {
    const settings = this.userSettings.get(userId);
    if (settings) {
      return { ...settings }; // Return a copy to prevent external modifications
    }
    // Return a copy of default settings
    return { ...DEFAULT_TELEPROMPTER_SETTINGS };
  }

  /**
   * Save settings for a specific user
   */
  saveUserSettings(userId: string, settings: TeleprompterSettings): void {
    // Validate settings before saving
    this.validateSettings(settings);
    // Store a copy to prevent external modifications
    this.userSettings.set(userId, { ...settings });
  }

  /**
   * Clear all settings (useful for testing)
   */
  clearAllSettings(): void {
    this.userSettings.clear();
  }

  /**
   * Validate settings structure
   * Throws an error if settings are invalid
   */
  private validateSettings(settings: TeleprompterSettings): void {
    const requiredFields: (keyof TeleprompterSettings)[] = [
      'line_width',
      'scroll_speed',
      'number_of_lines',
      'text_to_read',
      'auto_replay',
      'speech_scroll_enabled',
      'show_estimated_total'
    ];

    for (const field of requiredFields) {
      if (!(field in settings)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate specific field types and ranges
    if (typeof settings.line_width !== 'string') {
      throw new Error('line_width must be a string');
    }

    if (typeof settings.scroll_speed !== 'number' || settings.scroll_speed < 1 || settings.scroll_speed > 500) {
      throw new Error('scroll_speed must be a number between 1 and 500');
    }

    if (typeof settings.number_of_lines !== 'string') {
      throw new Error('number_of_lines must be a string');
    }

    if (typeof settings.text_to_read !== 'string') {
      throw new Error('custom_text must be a string');
    }

    if (typeof settings.auto_replay !== 'boolean') {
      throw new Error('auto_replay must be a boolean');
    }

    if (typeof settings.speech_scroll_enabled !== 'boolean') {
      throw new Error('speech_scroll_enabled must be a boolean');
    }

    if (typeof settings.show_estimated_total !== 'boolean') {
      throw new Error('show_estimated_total must be a boolean');
    }
  }
}