export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getSongById, artistData } from '@/lib/mock-data';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const artistId = params.id;
    const artistNum = parseInt(artistId);
    
    if (isNaN(artistNum) || artistNum < 1 || artistNum > artistData.length) {
      return NextResponse.json({ error: 'Invalid artist ID' }, { status: 400 });
    }
    
    const artist = artistData[artistNum - 1];
    
    // Get songs by this artist (every 25th song belongs to this artist in our generation logic)
    const songs = [];
    const maxSongs = 50;
    for (let i = 1; i <= 1000000 && songs.length < maxSongs; i++) {
      const song = getSongById(i);
      if (song.artist.id === artistId) {
        songs.push(song);
      }
      if (songs.length >= 20) break;
    }
    
    // Get albums (extract unique albums from songs)
    const albumsMap = new Map();
    songs.forEach(song => {
      if (!albumsMap.has(song.album.id)) {
        albumsMap.set(song.album.id, song.album);
      }
    });
    const albums = Array.from(albumsMap.values());
    
    return NextResponse.json({
      id: artist.id,
      name: artist.name,
      imageUrl: artist.imageUrl,
      bio: artist.bio,
      monthlyListeners: artist.monthlyListeners + Math.floor(Math.random() * 10000000),
      isVerified: true,
      albums,
      songs: songs.slice(0, 20),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch artist' }, { status: 500 });
  }
}
