export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { mockPlaylists } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ playlists: mockPlaylists });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch playlists' }, { status: 500 });
  }
}
