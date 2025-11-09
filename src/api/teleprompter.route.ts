import express, { Request, Response } from 'express';
import { TeleprompterApp } from '../index';

export const router = express.Router();

let app: TeleprompterApp;

export function setTelemprompterApp(teleprompterApp: TeleprompterApp): express.Router {
  app = teleprompterApp;
  return router;
}

// Extended Request type with authUserId from MentraOS SDK
interface AuthRequest extends Request {
  authUserId?: string;
}


async function startTeleprompter(req: AuthRequest, res: Response) {


}

async function updateSettings(req: AuthRequest, res:Response) {

}

async function getSettings(req:AuthRequest, res:Response) {

}

// Routes
router.get('/api/settings', getSettings);
router.post('/api/settings', updateSettings);
router.get('/api/start', startTeleprompter);