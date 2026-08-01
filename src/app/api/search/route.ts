export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { mockSongs, mockArtists, mockAlbums } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';

    if (!query) {
      return NextResponse.json({ songs: [], artists: [], albums: [] });
    }

    const songs = mockSongs.filter(s => 
      s.title.toLowerCase().includes(query) || 
      s.artist.name.toLowerCase().includes(query)
    );
    const artists = mockArtists.filter(a => a.name.toLowerCase().includes(query));
    const albums = mockAlbums.filter(a => 
      a.title.toLowerCase().includes(query) || 
      a.artist.name.toLowerCase().includes(query)
    );

    return NextResponse.json({ songs, artists, albums });
  } catch (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
