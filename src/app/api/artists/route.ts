import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (id) {
      const artist = await prisma.artist.findUnique({
        where: { id: parseInt(id) },
        include: {
          albums: {
            orderBy: { releaseYear: 'desc' },
            include: {
              songs: true,
            },
          },
        },
      });

      if (!artist) {
        return NextResponse.json(
          { error: 'Artist not found' },
          { status: 404 }
        );
      }

      // Get follower count
      const followerCount = await prisma.follow.count({
        where: { artistId: artist.id },
      });

      return NextResponse.json({ artist: { ...artist, followerCount } });
    }

    const artists = await prisma.artist.findMany({
      take: limit,
      skip: offset,
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ artists });
  } catch (error) {
    console.error('Get artists error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artists' },
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

    const { name, bio, imageUrl, verified } = await request.json();

    const artist = await prisma.artist.create({
      data: {
        name,
        bio,
        imageUrl,
        verified: verified || false,
      },
    });

    return NextResponse.json({ artist });
  } catch (error) {
    console.error('Create artist error:', error);
    return NextResponse.json(
      { error: 'Failed to create artist' },
      { status: 500 }
    );
  }
}
