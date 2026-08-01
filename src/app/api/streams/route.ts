import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { songId } = await request.json();
    
    if (!songId) {
      return NextResponse.json(
        { error: 'Song ID is required' },
        { status: 400 }
      );
    }

    const payload = await getCurrentUser();

    // Create stream record
    await prisma.stream.create({
      data: {
        userId: payload?.userId,
        songId,
      },
    });

    // Increment play count
    await prisma.song.update({
      where: { id: songId },
      data: { plays: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Stream error:', error);
    return NextResponse.json(
      { error: 'Failed to record stream' },
      { status: 500 }
    );
  }
}
