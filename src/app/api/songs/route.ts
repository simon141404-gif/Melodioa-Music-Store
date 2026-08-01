import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const albumId = searchParams.get('albumId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where = albumId ? { albumId: parseInt(albumId) } : {};

    const songs = await prisma.song.findMany({
      where,
      include: {
        album: {
          include: {
            artist: true,
          },
        },
      },
      orderBy: { trackNumber: 'asc' },
      take: limit,
      skip: offset,
    });

    // Check if user has liked each song
    const payload = await getCurrentUser();
    let likedSongIds: number[] = [];
    
    if (payload) {
      const likes = await prisma.like.findMany({
        where: { userId: payload.userId },
        select: { songId: true },
      });
      likedSongIds = likes.map(l => l.songId);
    }

    const songsWithLikes = songs.map(song => ({
      ...song,
      isLiked: likedSongIds.includes(song.id),
      artist: song.album?.artist,
    }));

    return NextResponse.json({ songs: songsWithLikes });
  } catch (error) {
    console.error('Get songs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch songs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getCurrentUser();
    
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { albumId, title, audioUrl, duration, trackNumber, lyrics } = await request.json();

    const song = await prisma.song.create({
      data: {
        albumId,
        title,
        audioUrl,
        duration: duration || 0,
        trackNumber,
        lyrics,
      },
    });

    return NextResponse.json({ song });
  } catch (error) {
    console.error('Create song error:', error);
    return NextResponse.json(
      { error: 'Failed to create song' },
      { status: 500 }
    );
  }
}
