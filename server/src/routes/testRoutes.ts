import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/test-db', async (req: Request, res: Response) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    if (isConnected) {
      res.json({
        connected: true,
        details: 'Successfully connected to MongoDB database.'
      });
    } else {
      res.status(503).json({
        connected: false,
        error: 'Database is disconnected',
        details: 'Mongoose state: ' + mongoose.connection.readyState
      });
    }
  } catch (error: any) {
    res.status(500).json({
      connected: false,
      error: error.message || 'Unknown database connection error',
      details: error.stack
    });
  }
});

export default router;
