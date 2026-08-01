export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { mockSongs } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    // Shuffle songs for recommendations
    const shuffled = [...mockSongs].sort(() => Math.random() - 0.5);
    return NextResponse.json({ songs: shuffled.slice(0, 10) });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
  }
}
