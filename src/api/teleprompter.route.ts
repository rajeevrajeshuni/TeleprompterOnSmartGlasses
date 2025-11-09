import express, { Response } from 'express';
import { TeleprompterApp } from '../index';
import { AuthRequest, createAuthMiddleware } from './auth';
import { DummyAppSession } from '../testing/DummyAppSession';

export const router = express.Router();
const NODE_ENV = process.env.NODE_ENV || 'production';
const IS_DEV_MODE = NODE_ENV === 'development';

let app: TeleprompterApp;
let authMiddleware: ReturnType<typeof createAuthMiddleware> | undefined;

export function setupTeleprompterRouter(teleprompterApp: TeleprompterApp, apiKey: string): express.Router {
  app = teleprompterApp;
  authMiddleware = createAuthMiddleware(apiKey);
  
  // Setup routes after middleware is initialized
  setupRoutes();
  
  return router;
}

/**
 * Setup routes with authentication middleware
 * Called after authMiddleware is initialized
 */
function setupRoutes() {
  if (!authMiddleware) {
    throw new Error('Auth middleware not initialized');
  }
  
  // Routes with authentication middleware
  router.get('/api/settings', authMiddleware, getSettings);
  router.put('/api/settings', express.json(), authMiddleware, updateSettings);
  router.post('/api/start-teleprompter', express.json(), authMiddleware, startTeleprompter);
  router.post('/api/stop-teleprompter', authMiddleware, stopTeleprompter);
  router.post('/api/reset-teleprompter', authMiddleware, resetTeleprompter);
  if (IS_DEV_MODE) {
    // Development-only test endpoint (no auth required)
    router.post('/api/test/simulate-session', express.json(), simulateSession);
  }
}

/**
 * Get user settings
 * GET /api/settings
 */
async function getSettings(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId;
    
    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'userId is required'
      });
      return;
    }

    const settings = app.settingsManager.getUserSettings(userId);
    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Error fetching user settings:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Update user settings
 * PUT /api/settings
 */
async function updateSettings(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId;
    const { settings } = req.body;
    
    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'userId is required'
      });
      return;
    }

    if (!settings) {
      res.status(400).json({
        success: false,
        message: 'settings are required'
      });
      return;
    }

    // Save the settings using the settings manager
    app.settingsManager.saveUserSettings(userId, settings);
    
    res.json({
      success: true,
      message: 'Settings saved successfully',
      settings
    });
  } catch (error) {
    console.error('Error saving user settings:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}

/**
 * Start teleprompter with settings
 * POST /api/start-teleprompter
 */
async function startTeleprompter(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId;
    const { textToRead } = req.body;

    if (!textToRead) {
      res.status(400).json({
        success: false,
        message: 'textToRead is required'
      });
      return;
    }
    console.log('Received teleprompter start request with textToRead:', textToRead);
    
    app.startScrollingToUser(userId!, textToRead)

    res.json({
      success: true,
      message: 'Starting teleprompter',
    });

  } catch (error) {
    console.error('Error processing start-teleprompter request:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Stop teleprompter
 * POST /api/stop-teleprompter
 */
async function stopTeleprompter(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId;
    
    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'userId is required'
      });
      return;
    }

    // Get the active session for this user
    const activeSession = app.getActiveSessionForUser(userId);
    
    if (!activeSession) {
      res.status(404).json({
        success: false,
        message: 'No active teleprompter session found'
      });
      return;
    }

    // Stop the scrolling
    app.stopScrolling(activeSession.sessionId);
    
    res.json({
      success: true,
      message: 'Teleprompter stopped successfully'
    });

  } catch (error) {
    console.error('Error stopping teleprompter:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Reset teleprompter (restart from beginning)
 * POST /api/reset-teleprompter
 */
async function resetTeleprompter(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId;
    
    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'userId is required'
      });
      return;
    }

    // Get the active session for this user
    const activeSession = app.getActiveSessionForUser(userId);
    
    if (!activeSession) {
      res.status(404).json({
        success: false,
        message: 'No active teleprompter session found'
      });
      return;
    }

    // Stop current scrolling
    app.stopScrolling(activeSession.sessionId);
    
    // Restart scrolling from the beginning
    app.startScrolling(activeSession.session, activeSession.sessionId, userId);
    
    res.json({
      success: true,
      message: 'Teleprompter reset successfully'
    });

  } catch (error) {
    console.error('Error resetting teleprompter:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Simulate a glass session for testing (development only)
 * POST /api/test/simulate-session
 */
async function simulateSession(req: express.Request, res: Response) {
  try {
    // Only allow in development mode
    if (process.env.NODE_ENV !== 'development') {
      res.status(403).json({
        success: false,
        message: 'This endpoint is only available in development mode'
      });
      return;
    }

    const { userId, sessionId } = req.body;
    const testUserId = userId || 'test-user';
    const testSessionId = sessionId || `manual-test-${Date.now()}`;

    console.log(`\n🧪 Manual test session requested for user: ${testUserId}`);

    // Create a dummy session
    const dummySession = new DummyAppSession();

    // Call onSession with the dummy session
    await (app as any).onSession(
      dummySession as any,
      testSessionId,
      testUserId
    );

    res.json({
      success: true,
      message: 'Dummy session created successfully',
      userId: testUserId,
      sessionId: testSessionId
    });

  } catch (error) {
    console.error('Error creating dummy session:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}
