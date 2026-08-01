export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getSongs, TOTAL_SONGS } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const songs = getSongs(page, limit);

    return NextResponse.json({ 
      songs,
      total: TOTAL_SONGS,
      page,
      totalPages: Math.ceil(TOTAL_SONGS / limit)
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch songs' }, { status: 500 });
  }
}
