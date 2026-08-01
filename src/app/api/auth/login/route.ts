export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { generateToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Demo login - works without database
    if (email === 'simon141.404@gmail.com' && password === 'ghost_404') {
      const token = generateToken({
        userId: 'demo-user-123',
        email: 'simon141.404@gmail.com',
        role: 'admin',
        premiumStatus: 'premium',
      });
      
      setAuthCookie(token);
      
      return NextResponse.json({
        user: {
          id: 'demo-user-123',
          email: 'simon141.404@gmail.com',
          name: 'Simon',
          avatarUrl: null,
          role: 'admin',
          premiumStatus: 'premium',
        },
      });
    }

    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}
