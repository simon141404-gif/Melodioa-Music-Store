import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const artistId = searchParams.get('artistId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {};
    if (id) where.id = parseInt(id);
    if (artistId) where.artistId = parseInt(artistId);

    if (id) {
      const album = await prisma.album.findUnique({
        where: { id: parseInt(id) },
        include: {
          artist: true,
          songs: {
            orderBy: { trackNumber: 'asc' },
          },
        },
      });

      if (!album) {
        return NextResponse.json(
          { error: 'Album not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ album });
    }

    const albums = await prisma.album.findMany({
      where,
      include: {
        artist: true,
        songs: {
          select: { id: true },
        },
      },
      orderBy: { releaseYear: 'desc' },
      take: limit,
      skip: offset,
    });

    const albumsWithCount = albums.map(album => ({
      ...album,
      songCount: album.songs.length,
      songs: undefined,
    }));

    return NextResponse.json({ albums: albumsWithCount });
  } catch (error) {
    console.error('Get albums error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch albums' },
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

    const { artistId, title, coverUrl, releaseYear, genre } = await request.json();

    const album = await prisma.album.create({
      data: {
        artistId,
        title,
        coverUrl,
        releaseYear: releaseYear || new Date().getFullYear(),
        genre,
      },
    });

    return NextResponse.json({ album });
  } catch (error) {
    console.error('Create album error:', error);
    return NextResponse.json(
      { error: 'Failed to create album' },
      { status: 500 }
    );
  }
}
