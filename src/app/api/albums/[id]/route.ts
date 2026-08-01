export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getSongById, getSongs } from '@/lib/mock-data';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const albumId = params.id;
    // Extract album number from id (e.g., "album-1" -> 1)
    const albumNum = parseInt(albumId.replace('album-', ''));
    
    if (isNaN(albumNum)) {
      return NextResponse.json({ error: 'Invalid album ID' }, { status: 400 });
    }
    
    // Calculate the range of songs for this album (10 songs per album)
    const startSongNum = (albumNum - 1) * 10 + 1;
    const endSongNum = startSongNum + 10;
    
    // Get songs for this album
    const songs = [];
    for (let i = startSongNum; i < endSongNum; i++) {
      songs.push(getSongById(i));
    }
    
    // Get album info from the first song
    const firstSong = songs[0];
    
    return NextResponse.json({
      id: albumId,
      title: firstSong.album.title,
      artist: firstSong.artist,
      coverUrl: firstSong.album.coverUrl,
      releaseYear: firstSong.album.releaseYear,
      genre: firstSong.genre,
      totalTracks: songs.length,
      songs,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch album' }, { status: 500 });
  }
}
