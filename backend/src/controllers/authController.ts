import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { registerSchema, loginSchema, updateProfileSchema } from '../schemas/auth.schema';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const data = registerSchema.parse(req.body);
    const result = await AuthService.register(data.name, data.email, data.password);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    if (err instanceof Error && err.message === 'EMAIL_ALREADY_EXISTS') {
      next(new AppError(409, 'AUTH_007', '该邮箱已被注册'));
    } else {
      next(err);
    }
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const data = loginSchema.parse(req.body);
    const result = await AuthService.login(data.email, data.password);
    res.json({ success: true, data: result });
  } catch (err) {
    if (err instanceof Error && err.message === 'INVALID_CREDENTIALS') {
      next(new AppError(401, 'AUTH_001', '邮箱或密码错误'));
    } else {
      next(err);
    }
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { token } = req.body;
    if (!token) {
      throw new AppError(400, 'REQ_002', '缺少token参数');
    }
    const result = await AuthService.refresh(token);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await AuthService.getProfile(req.user!.userId);
    res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = updateProfileSchema.parse(req.body);
    const user = await AuthService.updateProfile(req.user!.userId, data);
    res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
}
