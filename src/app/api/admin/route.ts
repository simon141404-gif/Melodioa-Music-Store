import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const payload = await getCurrentUser();
    
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const [
      totalUsers,
      totalArtists,
      totalAlbums,
      totalSongs,
      totalStreams,
      recentUsers,
      recentStreams,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.artist.count(),
      prisma.album.count(),
      prisma.song.count(),
      prisma.stream.count(),
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          premiumStatus: true,
          createdAt: true,
        },
      }),
      prisma.stream.findMany({
        take: 20,
        orderBy: { playedAt: 'desc' },
        include: {
          song: {
            include: { album: { include: { artist: true } } },
          },
        },
      }),
    ]);

    const streamsByDay = await prisma.stream.groupBy({
      by: ['playedAt'],
      _count: true,
      orderBy: { playedAt: 'desc' },
      take: 7,
    });

    return NextResponse.json({
      stats: {
        totalUsers,
        totalArtists,
        totalAlbums,
        totalSongs,
        totalStreams,
      },
      recentUsers,
      recentStreams: recentStreams.map(s => ({
        ...s,
        songTitle: s.song.title,
        artistName: s.song.album?.artist?.name,
      })),
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}
