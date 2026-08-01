export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ user: null });
    }
    return NextResponse.json({
      user: {
        id: user.userId,
        email: user.email,
        name: 'Simon',
        role: user.role,
        premiumStatus: user.premiumStatus,
      },
    });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}
