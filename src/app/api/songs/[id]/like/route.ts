import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const payload = await getCurrentUser();
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Song ID is required' },
        { status: 400 }
      );
    }

    const songId = parseInt(id);

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_songId: {
          userId: payload.userId,
          songId,
        },
      },
    });

    if (existingLike) {
      return NextResponse.json({ success: true, liked: true });
    }

    await prisma.like.create({
      data: {
        userId: payload.userId,
        songId,
      },
    });

    return NextResponse.json({ success: true, liked: true });
  } catch (error) {
    console.error('Like song error:', error);
    return NextResponse.json(
      { error: 'Failed to like song' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const payload = await getCurrentUser();
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Song ID is required' },
        { status: 400 }
      );
    }

    const songId = parseInt(id);

    await prisma.like.deleteMany({
      where: {
        userId: payload.userId,
        songId,
      },
    });

    return NextResponse.json({ success: true, liked: false });
  } catch (error) {
    console.error('Unlike song error:', error);
    return NextResponse.json(
      { error: 'Failed to unlike song' },
      { status: 500 }
    );
  }
}
