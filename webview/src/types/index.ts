// Type exports for teleprompter functionality

export interface TeleprompterSettings {
  line_width: string;
  scroll_speed: number;
  number_of_lines: string;
  custom_text: string;
  auto_replay: boolean;
  speech_scroll_enabled: boolean;
  show_estimated_total: boolean;
}

export interface StartTeleprompterRequest {
  settings: TeleprompterSettings;
}

export interface StartTeleprompterResponse {
  success: boolean;
  message: string;
  sessionId?: string;
}