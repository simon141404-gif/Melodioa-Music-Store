export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { removeAuthCookie } from '@/lib/auth';

export async function POST() {
  removeAuthCookie();
  return NextResponse.json({ success: true });
}
