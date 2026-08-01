import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (id) {
      const playlist = await prisma.playlist.findUnique({
        where: { id: parseInt(id) },
        include: {
          user: {
            select: { id: true, name: true, avatarUrl: true },
          },
          songs: {
            include: {
              song: {
                include: {
                  album: {
                    include: {
                      artist: true,
                    },
                  },
                },
              },
            },
            orderBy: { position: 'asc' },
          },
        },
      });

      if (!playlist) {
        return NextResponse.json(
          { error: 'Playlist not found' },
          { status: 404 }
        );
      }

      const playlistWithDetails = {
        ...playlist,
        songCount: playlist.songs.length,
        songs: playlist.songs.map(ps => ({
          ...ps.song,
          artist: ps.song.album?.artist,
          album: undefined,
        })),
      };

      return NextResponse.json({ playlist: playlistWithDetails });
    }

    const payload = await getCurrentUser();
    const where: any = {};
    
    if (userId) {
      where.userId = parseInt(userId);
    } else if (payload) {
      where.OR = [
        { isPublic: true },
        { userId: payload.userId },
      ];
    } else {
      where.isPublic = true;
    }

    const playlists = await prisma.playlist.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true },
        },
        songs: {
          select: { songId: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const playlistsWithCount = playlists.map(playlist => ({
      ...playlist,
      songCount: playlist.songs.length,
      songs: undefined,
    }));

    return NextResponse.json({ playlists: playlistsWithCount });
  } catch (error) {
    console.error('Get playlists error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch playlists' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getCurrentUser();
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, description, coverUrl, isPublic } = await request.json();

    const playlist = await prisma.playlist.create({
      data: {
        userId: payload.userId,
        title,
        description,
        coverUrl,
        isPublic: isPublic ?? true,
      },
    });

    return NextResponse.json({ playlist });
  } catch (error) {
    console.error('Create playlist error:', error);
    return NextResponse.json(
      { error: 'Failed to create playlist' },
      { status: 500 }
    );
  }
}
