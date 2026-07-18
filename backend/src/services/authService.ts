import prisma from '../utils/prisma';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { generateToken, refreshToken } from '../utils/jwt';

export class AuthService {
  static async register(name: string, email: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new Error('EMAIL_ALREADY_EXISTS');
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        membership: true,
        credits: true,
        createdAt: true,
      },
    });

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });
    return { user, token };
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  static async refresh(token: string) {
    const newToken = refreshToken(token);
    return { token: newToken };
  }

  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        membership: true,
        membershipExpiry: true,
        credits: true,
        dailyGoal: true,
        reviewTime: true,
        pronunciationPref: true,
        studyStreak: true,
        cachedTotalWords: true,
        cachedLearnedWords: true,
        cachedMasteredWords: true,
        cachedErrorCount: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }
    return user;
  }

  static async updateProfile(userId: string, data: any) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        dailyGoal: true,
        reviewTime: true,
        pronunciationPref: true,
      },
    });
    return user;
  }
}
