import { Request, Response, NextFunction } from 'express';

const requestCounts = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMITS: Record<string, number> = {
  '/api/auth/login': 10,
  '/api/auth/register': 5,
  '/api/dictionary/search': 30,
  default: 100,
};

export function rateLimiter(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const key = `${ip}:${req.path}`;
  const now = Date.now();

  let record = requestCounts.get(key);
  if (!record || now > record.resetTime) {
    record = { count: 0, resetTime: now + 60000 };
    requestCounts.set(key, record);
  }

  const limit = RATE_LIMITS[req.path] || RATE_LIMITS.default;
  record.count++;

  if (record.count > limit) {
    res.status(429).json({
      success: false,
      error: {
        code: 'REQ_003',
        message: '请求过于频繁，请稍后再试',
      },
    });
    return;
  }

  next();
}

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of requestCounts.entries()) {
    if (now > record.resetTime) {
      requestCounts.delete(key);
    }
  }
}, 300000);
