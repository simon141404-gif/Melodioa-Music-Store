import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    if (!query || query.length < 2) {
      return NextResponse.json({ songs: [], artists: [], albums: [], playlists: [] });
    }

    const searchTerm = `%${query}%`;

    const [songs, artists, albums, playlists] = await Promise.all([
      prisma.song.findMany({
        where: { title: { contains: query } },
        include: {
          album: {
            include: { artist: true },
          },
        },
        take: 10,
      }),
      prisma.artist.findMany({
        where: { name: { contains: query } },
        take: 5,
      }),
      prisma.album.findMany({
        where: { 
          OR: [
            { title: { contains: query } },
            { genre: { contains: query } },
          ],
        },
        include: { artist: true },
        take: 10,
      }),
      prisma.playlist.findMany({
        where: {
          AND: [
            { isPublic: true },
            { title: { contains: query } },
          ],
        },
        include: {
          user: { select: { name: true } },
          songs: { select: { songId: true } },
        },
        take: 5,
      }),
    ]);

    const songsWithArtist = songs.map(song => ({
      ...song,
      artist: song.album?.artist,
    }));

    const playlistsWithCount = playlists.map(playlist => ({
      ...playlist,
      songCount: playlist.songs.length,
      songs: undefined,
    }));

    return NextResponse.json({
      songs: songsWithArtist,
      artists,
      albums,
      playlists: playlistsWithCount,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
