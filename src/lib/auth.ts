import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'melodia-secret-key-2024';

export interface TokenPayload {
  userId: number;
  email: string;
  role: string;
  premiumStatus: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function setAuthCookie(token: string) {
  cookies().set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export function getAuthCookie(): string | undefined {
  return cookies().get('auth-token')?.value;
}

export function removeAuthCookie() {
  cookies().delete('auth-token');
}

export async function getCurrentUser() {
  const token = getAuthCookie();
  if (!token) return null;
  
  const payload = verifyToken(token);
  if (!payload) return null;
  
  return payload;
}
