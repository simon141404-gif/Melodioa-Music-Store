export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    // Get recently played songs for recommendations
    // For demo, we'll return random songs from different genres
    
    const [electronicSongs, indieSongs, rbSongs] = await Promise.all([
      prisma.song.findMany({
        where: {
          album: {
            genre: 'Electronic',
          },
        },
        include: {
          album: {
            include: { artist: true },
          },
        },
        take: 5,
      }),
      prisma.song.findMany({
        where: {
          album: {
            genre: 'Indie Rock',
          },
        },
        include: {
          album: {
            include: { artist: true },
          },
        },
        take: 5,
      }),
      prisma.song.findMany({
        where: {
          album: {
            genre: 'R&B',
          },
        },
        include: {
          album: {
            include: { artist: true },
          },
        },
        take: 5,
      }),
    ]);

    // Get popular songs
    const popularSongs = await prisma.song.findMany({
      include: {
        album: {
          include: { artist: true },
        },
      },
      orderBy: { plays: 'desc' },
      take: 10,
    });

    // Get new releases
    const newReleases = await prisma.album.findMany({
      include: {
        artist: true,
        songs: true,
      },
      orderBy: { releaseYear: 'desc' },
      take: 6,
    });

    // Get featured playlists
    const playlists = await prisma.playlist.findMany({
      where: { isPublic: true },
      include: {
        user: { select: { name: true } },
        songs: { select: { songId: true } },
      },
      take: 5,
    });

    const playlistsWithCount = playlists.map(playlist => ({
      ...playlist,
      songCount: playlist.songs.length,
      songs: undefined,
    }));

    return NextResponse.json({
      madeForYou: electronicSongs.map(s => ({ ...s, artist: s.album?.artist })),
      newReleases,
      topCharts: popularSongs.map(s => ({ ...s, artist: s.album?.artist })),
      featuredPlaylists: playlistsWithCount,
      genres: ['Electronic', 'Indie Rock', 'Synthwave', 'R&B', 'Progressive'],
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}
