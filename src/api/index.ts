import { Express } from 'express';
import { router as healthRouter } from './health.route';
import { TeleprompterApp } from '..';
import { router as teleprompterRouter, setTelemprompterApp } from './teleprompter.route';

export function setupAPI(app: Express, teleprompterApp: TeleprompterApp) {
  // Setup route handlers with app instance
  setTelemprompterApp(teleprompterApp);
  
  // Mount routes
  app.use('/', teleprompterRouter);
  app.use('/', healthRouter);
}

