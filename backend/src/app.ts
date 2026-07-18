import express from 'express';
import cors from 'cors';
import path from 'path';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';

import authRoutes from './routes/auth';
import wordbookRoutes from './routes/wordbook';
import studyRoutes from './routes/study';
import reviewRoutes from './routes/review';
import errorBookRoutes from './routes/errorBook';
import vocabularyTestRoutes from './routes/vocabularyTest';
import dictionaryRoutes from './routes/dictionary';
import coursewareRoutes from './routes/courseware';
import userRoutes from './routes/user';
import membershipRoutes from './routes/membership';
import referralRoutes from './routes/referral';
import scheduleRoutes from './routes/schedule';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/wordbooks', wordbookRoutes);
app.use('/api/study', studyRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/error-book', errorBookRoutes);
app.use('/api/vocabulary-test', vocabularyTestRoutes);
app.use('/api/dictionary', dictionaryRoutes);
app.use('/api/courseware', coursewareRoutes);
app.use('/api/user', userRoutes);
app.use('/api/membership', membershipRoutes);
app.use('/api/referral', referralRoutes);
app.use('/api/schedule', scheduleRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

// Error handler
app.use(errorHandler);

export default app;
