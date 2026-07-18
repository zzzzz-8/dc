import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tdtd-jwt-secret-key-2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as any);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export function refreshToken(token: string): string {
  const decoded = verifyToken(token);
  return generateToken({
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role,
  });
}
