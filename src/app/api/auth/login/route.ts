export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';

// Auto-create default user and sample data on first login
async function ensureDefaultUser() {
  const bcrypt = require('bcryptjs');
  const defaultEmail = 'simon141.404@gmail.com';
  const defaultPassword = 'ghost_404';
  
  const existingUser = await prisma.user.findUnique({
    where: { email: defaultEmail },
  });

  if (!existingUser) {
    const passwordHash = await bcrypt.hash(defaultPassword, 10);
    const user = await prisma.user.create({
      data: {
        email: defaultEmail,
        name: 'Simon',
        passwordHash,
        role: 'admin',
        premiumStatus: 'premium',
      },
    });

    // Create sample artists
    const artists = await Promise.all([
      prisma.artist.create({
        data: { name: 'The Weeknd', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb5ba2d1ed7c3d5a30ad3c9702', bio: 'Canadian singer-songwriter' },
      }),
      prisma.artist.create({
        data: { name: 'Taylor Swift', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb7e7c3e7e40a3c2c51c5e5d4a', bio: 'American singer-songwriter' },
      }),
      prisma.artist.create({
        data: { name: 'Ed Sheeran', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb5b2b22c5e5d4c5e5d4c5e5d4', bio: 'British singer-songwriter' },
      }),
      prisma.artist.create({
        data: { name: 'Dua Lipa', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb8c2e5d4c5e5d4c5e5d4c5e5d4', bio: 'British-Albanian singer' },
      }),
      prisma.artist.create({
        data: { name: 'Drake', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb9d2e5d4c5e5d4c5e5d4c5e5d4', bio: 'Canadian rapper' },
      }),
    ]);

    // Create sample albums
    const albums = await Promise.all([
      prisma.album.create({
        data: { title: 'After Hours', artistId: artists[0].id, coverUrl: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36', releaseYear: 2020, genre: 'R&B' },
      }),
      prisma.album.create({
        data: { title: 'Midnight Nights', artistId: artists[1].id, coverUrl: 'https://i.scdn.co/image/ab67616d0000b273d4a5e5d4c5e5d4c5e5d4c5e5d4', releaseYear: 2023, genre: 'Pop' },
      }),
      prisma.album.create({
        data: { title: 'Divide', artistId: artists[2].id, coverUrl: 'https://i.scdn.co/image/ab67616d0000b273e5a5e5d4c5e5d4c5e5d4c5e5d4', releaseYear: 2017, genre: 'Pop' },
      }),
    ]);

    // Create sample songs
    await Promise.all([
      prisma.song.create({
        data: { title: 'Blinding Lights', artistId: artists[0].id, albumId: albums[0].id, duration: 200, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', coverUrl: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36', genre: 'R&B', trackNumber: 1 },
      }),
      prisma.song.create({
        data: { title: 'Save Your Tears', artistId: artists[0].id, albumId: albums[0].id, duration: 215, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', coverUrl: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36', genre: 'R&B', trackNumber: 2 },
      }),
      prisma.song.create({
        data: { title: 'Anti-Hero', artistId: artists[1].id, albumId: albums[1].id, duration: 200, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', coverUrl: 'https://i.scdn.co/image/ab67616d0000b273d4a5e5d4c5e5d4c5e5d4c5e5d4', genre: 'Pop', trackNumber: 1 },
      }),
      prisma.song.create({
        data: { title: 'Shape of You', artistId: artists[2].id, albumId: albums[2].id, duration: 234, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', coverUrl: 'https://i.scdn.co/image/ab67616d0000b273e5a5e5d4c5e5d4c5e5d4c5e5d4', genre: 'Pop', trackNumber: 1 },
      }),
      prisma.song.create({
        data: { title: 'Levitating', artistId: artists[3].id, duration: 203, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', coverUrl: 'https://i.scdn.co/image/ab67616d0000b273f5b5e5d4c5e5d4c5e5d4c5e5d4', genre: 'Pop', trackNumber: 1 },
      }),
    ]);

    console.log('Default user and sample data created');
  }
}

export async function POST(request: NextRequest) {
  try {
    // Ensure default user exists (for demo purposes)
    await ensureDefaultUser();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Allow demo login
    if (email === 'simon141.404@gmail.com' && password === 'ghost_404') {
      // Create or get demo user
      let demoUser = await prisma.user.findUnique({
        where: { email },
      });
      
      if (!demoUser) {
        const bcrypt = require('bcryptjs');
        const passwordHash = await bcrypt.hash(password, 10);
        demoUser = await prisma.user.create({
          data: {
            email,
            name: 'Simon',
            passwordHash,
            role: 'admin',
            premiumStatus: 'premium',
          },
        });
        
        // Create sample data
        const artists = await Promise.all([
          prisma.artist.create({ data: { name: 'The Weeknd', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb5ba2d1ed7c3d5a30ad3c9702' }}),
          prisma.artist.create({ data: { name: 'Taylor Swift', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb7e7c3e7e40a3c2c51c5e5d4a' }}),
          prisma.artist.create({ data: { name: 'Ed Sheeran', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb5b2b22c5e5d4c5e5d4c5e5d4' }}),
        ]);
        
        const albums = await Promise.all([
          prisma.album.create({ data: { title: 'After Hours', artistId: artists[0].id, coverUrl: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36', releaseYear: 2020 }}),
          prisma.album.create({ data: { title: 'Midnights', artistId: artists[1].id, coverUrl: 'https://i.scdn.co/image/ab67616d0000b273d4a5e5d4c5e5d4c5e5d4c5e5d4', releaseYear: 2022 }}),
        ]);
        
        await Promise.all([
          prisma.song.create({ data: { title: 'Blinding Lights', artistId: artists[0].id, albumId: albums[0].id, duration: 200, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', coverUrl: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36', trackNumber: 1 }}),
          prisma.song.create({ data: { title: 'Save Your Tears', artistId: artists[0].id, albumId: albums[0].id, duration: 215, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', coverUrl: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36', trackNumber: 2 }}),
          prisma.song.create({ data: { title: 'Anti-Hero', artistId: artists[1].id, albumId: albums[1].id, duration: 200, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', coverUrl: 'https://i.scdn.co/image/ab67616d0000b273d4a5e5d4c5e5d4c5e5d4c5e5d4', trackNumber: 1 }}),
          prisma.song.create({ data: { title: 'Shape of You', artistId: artists[2].id, duration: 234, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', coverUrl: 'https://i.scdn.co/image/ab67616d0000b273e5a5e5d4c5e5d4c5e5d4c5e5d4', trackNumber: 1 }}),
        ]);
      }
      
      const token = generateToken({
        userId: demoUser.id,
        email: demoUser.email,
        role: demoUser.role,
        premiumStatus: demoUser.premiumStatus,
      });
      
      setAuthCookie(token);
      
      return NextResponse.json({
        user: {
          id: demoUser.id,
          email: demoUser.email,
          name: demoUser.name,
          avatarUrl: demoUser.avatarUrl,
          role: demoUser.role,
          premiumStatus: demoUser.premiumStatus,
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const bcrypt = require('bcryptjs');
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      premiumStatus: user.premiumStatus,
    });

    setAuthCookie(token);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        role: user.role,
        premiumStatus: user.premiumStatus,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}
