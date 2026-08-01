export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { mockAlbums } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    return NextResponse.json({ albums: mockAlbums.slice(0, limit) });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch albums' }, { status: 500 });
  }
}
