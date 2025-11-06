# Teleprompter Settings Implementation

## Overview
This document describes the implementation of the teleprompter settings configuration page and API endpoint.

## 1. Session Settings Identified

From the backend code in [`src/index.ts`](src/index.ts:842-848), the following session settings are used:

| Setting Name | Type | Default Value | Description |
|--------------|------|---------------|-------------|
| `line_width` | string | `"Medium"` | Width of text lines (Small/Medium/Large) |
| `scroll_speed` | number | `120` | Scrolling speed in words per minute |
| `number_of_lines` | string | `"4"` | Number of lines to display (2-6) |
| `custom_text` | string | `''` | Custom text to display (empty uses default) |
| `auto_replay` | boolean | `false` | Automatically restart when text ends |
| `speech_scroll_enabled` | boolean | `true` | Enable speech-based scrolling |
| `show_estimated_total` | boolean | `true` | Show estimated total time in status bar |

## 2. Frontend Implementation

### Types Definition
Created [`webview/src/types/index.ts`](webview/src/types/index.ts) with:
- `TeleprompterSettings` interface
- `StartTeleprompterRequest` interface
- `StartTeleprompterResponse` interface

### Settings Page
Created [`webview/src/screens/TeleprompterSettings.tsx`](webview/src/screens/TeleprompterSettings.tsx) with:
- Form fields for all 7 settings
- Text area for custom text input (with copy/paste support)
- Select dropdowns for line width and number of lines
- Number input for scroll speed with validation (1-500 WPM)
- Toggle switches for boolean settings
- Default values pre-populated from backend defaults
- Responsive UI with Tailwind CSS styling
- Toast notifications for success/error feedback

### API Service
Updated [`webview/src/Api.ts`](webview/src/Api.ts) with:
- `startTeleprompter()` method that POSTs settings to backend
- Proper error handling and logging
- TypeScript type safety

### Routing
Updated [`webview/src/App.tsx`](webview/src/App.tsx) to add:
- `/settings` route for the TeleprompterSettings component

## 3. Backend Implementation

### API Endpoint
Added to [`src/index.ts`](src/index.ts:1153-1197):
- `POST /api/start-teleprompter` endpoint
- Accepts settings in request body
- Validates required fields
- Returns success/error response
- Logs received settings for debugging

### Endpoint Details
- **URL**: `/api/start-teleprompter`
- **Method**: POST
- **Content-Type**: application/json
- **Request Body**:
  ```json
  {
    "settings": {
      "line_width": "Medium",
      "scroll_speed": 120,
      "number_of_lines": "4",
      "custom_text": "Your text here...",
      "auto_replay": false,
      "speech_scroll_enabled": true,
      "show_estimated_total": true
    }
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Teleprompter settings received. Connect your smart glasses to start the teleprompter.",
    "settings": { ... }
  }
  ```

## 4. Usage Flow

1. User navigates to `/settings` route in the webview
2. Form displays with default values pre-populated
3. User can:
   - Enter or paste custom text in the textarea
   - Adjust line width (Small/Medium/Large)
   - Set scroll speed (1-500 WPM, recommended 120-180)
   - Choose number of lines (2-6)
   - Toggle auto-replay on/off
   - Toggle speech-based scrolling on/off
   - Toggle estimated total time display on/off
4. User clicks "Start Teleprompter" button
5. Settings are sent to backend API
6. Success/error toast notification is displayed
7. Backend logs settings and returns confirmation

## 5. Integration Notes

The current implementation provides the configuration interface and API endpoint. The actual teleprompter session creation happens through the Mentra SDK when a user connects their smart glasses. The settings endpoint can be extended to:

- Store user preferences in a database
- Apply settings to active sessions
- Trigger teleprompter start for connected devices
- Provide settings management for multiple users

## 6. Files Modified/Created

### Created:
- `webview/src/types/index.ts` - TypeScript type definitions
- `webview/src/screens/TeleprompterSettings.tsx` - Settings configuration page
- `TELEPROMPTER_SETTINGS_IMPLEMENTATION.md` - This documentation

### Modified:
- `webview/src/Api.ts` - Added startTeleprompter API method
- `webview/src/App.tsx` - Added /settings route
- `src/index.ts` - Added POST /api/start-teleprompter endpoint

## 7. Testing Recommendations

1. **Frontend Testing**:
   - Navigate to `/settings` route
   - Verify all form fields display with correct defaults
   - Test form validation (scroll speed range, required fields)
   - Test text area with copy/paste functionality
   - Verify toggle switches work correctly
   - Test form submission with various settings combinations

2. **Backend Testing**:
   - Send POST request to `/api/start-teleprompter` with valid settings
   - Test with missing required fields (should return 400 error)
   - Test with invalid data types
   - Verify settings are logged correctly
   - Check response format matches expected structure

3. **Integration Testing**:
   - Test end-to-end flow from form submission to API response
   - Verify toast notifications display correctly
   - Test error handling for network failures
   - Verify settings persistence (if implemented)