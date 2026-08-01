export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { searchSongs, searchArtists, searchAlbums, TOTAL_SONGS } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';

    if (!query) {
      return NextResponse.json({ 
        songs: [], 
        artists: [], 
        albums: [],
        totalSongs: TOTAL_SONGS 
      });
    }

    // Search across 1M songs
    const songs = searchSongs(query, 50);
    const artists = searchArtists(query, 20);
    const albums = searchAlbums(query, 20);

    return NextResponse.json({ 
      songs, 
      artists, 
      albums,
      totalSongs: TOTAL_SONGS
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
