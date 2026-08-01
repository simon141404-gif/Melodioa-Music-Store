import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const payload = await getCurrentUser();
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const likes = await prisma.like.findMany({
      where: { userId: payload.userId },
      include: {
        song: {
          include: {
            album: {
              include: { artist: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const songs = likes.map(like => ({
      ...like.song,
      isLiked: true,
      artist: like.song.album?.artist,
    }));

    return NextResponse.json({ songs });
  } catch (error) {
    console.error('Get likes error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch likes' },
      { status: 500 }
    );
  }
}
