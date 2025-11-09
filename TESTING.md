# Testing Guide - Teleprompter Without Smart Glasses

This guide explains how to test the Teleprompter application without physical smart glasses using the built-in development mode simulation.

## Overview

The teleprompter application includes a **DummyAppSession** class that simulates smart glasses connections in development mode. This allows you to:

- Test teleprompter functionality without hardware
- See scrolling text output in the console
- Develop and debug features locally
- Verify API endpoints and settings

## Setup

### 1. Configure Environment

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and set:

```env
PORT=3000
AUGMENTOS_API_KEY=your_api_key_here
PACKAGE_NAME=com.augmentos.teleprompter
NODE_ENV=development  # This enables testing mode
```

**Important:** `NODE_ENV=development` activates the dummy session simulation.

### 2. Start the Server

```bash
bun run dev
```

You should see:

```
🧪 Running in DEVELOPMENT mode - dummy session will be auto-created
com.augmentos.teleprompter server running on port 3000

🧪 Development Mode: Initializing dummy session...
✅ Creating dummy session for user: test-user
🧪 [DummyAppSession] Created dummy session for testing
✅ Dummy session initialized successfully
📝 Teleprompter will start scrolling with default text
💡 Use the webview to send custom text via /api/start-teleprompter
```

## How It Works

### Automatic Session Creation

When `NODE_ENV=development`, the server automatically:

1. Creates a `DummyAppSession` instance
2. Calls `onSession()` with user ID `test-user`
3. Initializes the teleprompter with default text
4. Starts auto-scrolling

### Console Output

Instead of sending text to smart glasses, the dummy session prints to console:

```
╔════════════════════════════════════════════════════════════════╗
║              TELEPROMPTER OUTPUT (SIMULATED)                   ║
╠════════════════════════════════════════════════════════════════╣
║ Time: 2025-11-09T15:30:00.000Z                                 ║
╠════════════════════════════════════════════════════════════════╣
[0%] | 00:00 | Est Total: --:--
Welcome to AugmentOS Teleprompter. This is a default text that
will scroll at your set speed. You can replace this with your own
content through the settings.
╚════════════════════════════════════════════════════════════════╝
```

The text updates every 500ms, simulating the scrolling behavior.

## Testing Scenarios

### 1. Test Default Scrolling

Simply start the server and watch the console. The default text will scroll automatically.

### 2. Test Custom Text

Use the API to send custom text:

```bash
curl -X POST http://localhost:3000/api/start-teleprompter \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key" \
  -d '{
    "textToRead": "This is my custom teleprompter text. It will scroll at the configured speed."
  }'
```

### 3. Test Settings Changes

Update teleprompter settings:

```bash
curl -X PUT http://localhost:3000/api/settings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key" \
  -d '{
    "settings": {
      "scrollSpeed": 150,
      "lineWidth": "medium",
      "numberOfLines": "4",
      "autoReplay": true,
      "speechScrollEnabled": false,
      "showEstimatedTotal": true
    }
  }'
```

### 4. Manual Session Creation

Create additional test sessions manually:

```bash
curl -X POST http://localhost:3000/api/test/simulate-session \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-2",
    "sessionId": "custom-session-id"
  }'
```

**Note:** This endpoint only works in development mode.

### 5. Test Stop/Reset

Stop the teleprompter:

```bash
curl -X POST http://localhost:3000/api/stop-teleprompter \
  -H "Authorization: Bearer your_api_key"
```

Reset to beginning:

```bash
curl -X POST http://localhost:3000/api/reset-teleprompter \
  -H "Authorization: Bearer your_api_key"
```

## DummyAppSession Features

The `DummyAppSession` class implements:

### ✅ Implemented Features

- **`layouts.showTextWall()`** - Prints formatted text to console
- **`events.onTranscription()`** - Returns no-op unsubscribe function
- **`ws.readyState`** - Always returns 1 (OPEN state)

### ❌ Not Implemented (Future)

- Speech transcription simulation
- Interactive controls
- Multiple simultaneous sessions

## Switching to Production

To use real smart glasses:

1. Update `.env`:
   ```env
   NODE_ENV=production
   ```

2. Restart the server:
   ```bash
   bun run dev
   ```

3. Connect your smart glasses normally

The server will now wait for real glass connections instead of creating dummy sessions.

## Troubleshooting

### Issue: No console output

**Solution:** Check that `NODE_ENV=development` in your `.env` file.

### Issue: "This endpoint is only available in development mode"

**Solution:** The `/api/test/simulate-session` endpoint requires `NODE_ENV=development`.

### Issue: Text not scrolling

**Solution:** Check console for errors. Ensure the dummy session was created successfully.

### Issue: Want to test with different settings

**Solution:** Use the `/api/settings` endpoint to update settings, then restart the session.

## File Structure

```
src/
├── index.ts                      # Main app with dev mode detection
├── testing/
│   └── DummyAppSession.ts       # Mock AppSession implementation
├── api/
│   └── teleprompter.route.ts    # Includes test endpoint
.env                              # Environment configuration
TESTING.md                        # This file
```

## Development Workflow

1. **Start server** with `NODE_ENV=development`
2. **Watch console** for scrolling text output
3. **Test API endpoints** using curl or Postman
4. **Modify settings** and observe changes
5. **Switch to production** when ready for real glasses

## API Endpoints Summary

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/settings` | GET | Yes | Get user settings |
| `/api/settings` | PUT | Yes | Update settings |
| `/api/start-teleprompter` | POST | Yes | Start with custom text |
| `/api/stop-teleprompter` | POST | Yes | Stop scrolling |
| `/api/reset-teleprompter` | POST | Yes | Reset to beginning |
| `/api/test/simulate-session` | POST | No | Create dummy session (dev only) |

## Next Steps

- Test all API endpoints
- Verify settings persistence
- Test edge cases (empty text, very long text)
- Prepare for production deployment

---

**Happy Testing! 🧪**