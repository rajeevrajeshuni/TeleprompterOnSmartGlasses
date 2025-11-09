import express, { Response } from 'express';
import { TeleprompterApp } from '../index';
import { AuthRequest, createAuthMiddleware } from './auth';
import { AppSession } from '@mentra/sdk';

export const router = express.Router();

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
