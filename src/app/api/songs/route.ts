export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { mockSongs } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const albumId = searchParams.get('albumId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let songs = [...mockSongs];
    
    if (albumId) {
      songs = songs.filter(s => s.albumId === albumId);
    }

    songs = songs.slice(offset, offset + limit);

    return NextResponse.json({ songs });
  } catch (error) {
    console.error('Songs error:', error);
    return NextResponse.json({ error: 'Failed to fetch songs' }, { status: 500 });
  }
}
