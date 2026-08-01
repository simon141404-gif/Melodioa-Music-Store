import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.stream.deleteMany();
  await prisma.download.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.like.deleteMany();
  await prisma.playlistSong.deleteMany();
  await prisma.playlist.deleteMany();
  await prisma.song.deleteMany();
  await prisma.album.deleteMany();
  await prisma.artist.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const passwordHash = await bcrypt.hash('password123', 12);
  
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@melodia.com',
      passwordHash,
      name: 'Admin User',
      role: 'admin',
      premiumStatus: 'premium',
    },
  });

  const freeUser = await prisma.user.create({
    data: {
      email: 'user@melodia.com',
      passwordHash,
      name: 'Free User',
      role: 'user',
      premiumStatus: 'free',
    },
  });

  const premiumUser = await prisma.user.create({
    data: {
      email: 'premium@melodia.com',
      passwordHash,
      name: 'Premium User',
      role: 'user',
      premiumStatus: 'premium',
    },
  });

  // Create artists
  const artists = await Promise.all([
    prisma.artist.create({
      data: {
        name: 'Aurora Dreams',
        bio: 'Electronic music producer known for atmospheric soundscapes and ambient textures.',
        imageUrl: 'https://picsum.photos/seed/artist1/400/400',
        verified: true,
      },
    }),
    prisma.artist.create({
      data: {
        name: 'The Midnight Collective',
        bio: 'Indie rock band blending nostalgic melodies with modern production.',
        imageUrl: 'https://picsum.photos/seed/artist2/400/400',
        verified: true,
      },
    }),
    prisma.artist.create({
      data: {
        name: 'Neon Pulse',
        bio: 'Synthwave artist creating retro-futuristic electronic beats.',
        imageUrl: 'https://picsum.photos/seed/artist3/400/400',
        verified: true,
      },
    }),
    prisma.artist.create({
      data: {
        name: 'Velvet Echo',
        bio: 'Soulful R&B vocalist with powerful vocals and emotional lyrics.',
        imageUrl: 'https://picsum.photos/seed/artist4/400/400',
        verified: false,
      },
    }),
    prisma.artist.create({
      data: {
        name: 'Cosmic Drift',
        bio: 'Progressive electronic artist pushing the boundaries of sound design.',
        imageUrl: 'https://picsum.photos/seed/artist5/400/400',
        verified: true,
      },
    }),
  ]);

  // Create albums and songs
  const albumsData = [
    { artistIndex: 0, title: 'Ethereal Journeys', year: 2024, genre: 'Electronic', songCount: 10 },
    { artistIndex: 1, title: 'City Lights', year: 2023, genre: 'Indie Rock', songCount: 12 },
    { artistIndex: 2, title: 'Retro Future', year: 2024, genre: 'Synthwave', songCount: 8 },
    { artistIndex: 3, title: 'Heartstrings', year: 2023, genre: 'R&B', songCount: 10 },
    { artistIndex: 4, title: 'Infinite Horizon', year: 2024, genre: 'Progressive', songCount: 6 },
    { artistIndex: 0, title: 'Digital Dawn', year: 2023, genre: 'Electronic', songCount: 9 },
    { artistIndex: 1, title: 'Neon Streets', year: 2022, genre: 'Indie Rock', songCount: 11 },
    { artistIndex: 2, title: 'Night Drive', year: 2023, genre: 'Synthwave', songCount: 10 },
    { artistIndex: 3, title: 'Soul Sessions', year: 2024, genre: 'R&B', songCount: 8 },
    { artistIndex: 4, title: 'Stellar Waves', year: 2023, genre: 'Progressive', songCount: 7 },
  ];

  const songTitles = [
    ['Starlight', 'Floating', 'Dreamscape', 'Aurora', 'Twilight', 'Horizon', 'Ethereal', 'Celestial', 'Momentum', 'Infinity'],
    ['City Lights', 'Downtown', 'Midnight Drive', 'Neon Signs', 'Urban Dreams', 'Lost in Tokyo', 'Night Owl', 'Electric Avenue', 'Rooftop', 'Last Train', 'Echoes', 'Home'],
    ['Retro Future', 'Nightcall', 'Digital Love', 'Cyber Dreams', 'Outrun', 'Chrome', 'Vector', 'Synth City'],
    ['Heartstrings', 'Love Song', 'Slow Dance', 'Tender', 'Emotions', 'Soulful', 'Whispers', 'Passion', 'Desire', 'Forever'],
    ['Infinite', 'Boundless', 'Timeless', 'Eternal', 'Transcendent', 'Cosmic'],
    ['Digital Dawn', 'Morning Light', 'Pixels', 'Circuit', 'Binary', 'Algorithm', 'Cloud', 'Network', 'System'],
    ['Neon Streets', 'Graffiti', 'Underground', 'Subway', 'Alleyway', 'Skyline', 'Bridge', 'Harbor', 'Station', 'Plaza', 'Boulevard'],
    ['Night Drive', 'Highway', 'Radar', 'Speedometer', 'Fuel', 'Engine', 'Wheels', 'Roads', 'Maps', 'Destiny'],
    ['Soul Sessions', 'Groove', 'Funk', 'Vibe', 'Rhythm', 'Melody', 'Harmony', 'Beat'],
    ['Stellar', 'Nebula', 'Galaxy', 'Orbit', 'Planet', 'Comet', 'Meteor'],
  ];

  const lyricsTemplate = `[Verse 1]
Looking at the night sky
Stars are shining bright
Dreams are floating upward
Everything feels right

[Pre-Chorus]
In this moment we are free
Nothing else matters
Just you and me

[Chorus]
Let the music take us higher
Higher than we've ever been
In this infinite horizon
We'll keep on floating again

[Verse 2]
Feel the rhythm in your soul
Let it carry you away
Every beat is a heartbeat
Every note is a word to say

[Bridge]
We are infinite
We are eternal
We are the sound
Of something fundamental

[Chorus]
Let the music take us higher
Higher than we've ever been
In this infinite horizon
We'll keep on floating again

[Outro]
Floating... forever...
In the music... together...`;

  const albums = [];
  let songId = 1;
  
  for (let i = 0; i < albumsData.length; i++) {
    const albumData = albumsData[i];
    const artist = artists[albumData.artistIndex];
    
    const album = await prisma.album.create({
      data: {
        artistId: artist.id,
        title: albumData.title,
        coverUrl: `https://picsum.photos/seed/album${i + 1}/400/400`,
        releaseYear: albumData.year,
        genre: albumData.genre,
      },
    });
    albums.push(album);
    
    const titles = songTitles[i % songTitles.length];
    for (let j = 0; j < titles.length; j++) {
      await prisma.song.create({
        data: {
          albumId: album.id,
          title: titles[j],
          audioUrl: null,
          duration: 180 + Math.floor(Math.random() * 120),
          trackNumber: j + 1,
          lyrics: lyricsTemplate,
          plays: Math.floor(Math.random() * 10000),
        },
      });
      songId++;
    }
  }

  // Create playlists
  const allSongs = await prisma.song.findMany();
  
  const likedPlaylist = await prisma.playlist.create({
    data: {
      userId: freeUser.id,
      title: 'Liked Songs',
      description: 'Songs you have liked',
      coverUrl: 'https://picsum.photos/seed/liked/400/400',
      isPublic: false,
    },
  });

  const discoverPlaylist = await prisma.playlist.create({
    data: {
      userId: freeUser.id,
      title: 'Discover Weekly',
      description: 'New music curated just for you',
      coverUrl: 'https://picsum.photos/seed/discover/400/400',
      isPublic: true,
    },
  });

  const chillPlaylist = await prisma.playlist.create({
    data: {
      userId: premiumUser.id,
      title: 'Chill Vibes',
      description: 'Perfect for relaxation',
      coverUrl: 'https://picsum.photos/seed/chill/400/400',
      isPublic: true,
    },
  });

  const workoutPlaylist = await prisma.playlist.create({
    data: {
      userId: premiumUser.id,
      title: 'Workout Energy',
      description: 'High energy tracks to fuel your workout',
      coverUrl: 'https://picsum.photos/seed/workout/400/400',
      isPublic: true,
    },
  });

  const focusPlaylist = await prisma.playlist.create({
    data: {
      userId: adminUser.id,
      title: 'Focus Mode',
      description: 'Concentration enhancing tracks',
      coverUrl: 'https://picsum.photos/seed/focus/400/400',
      isPublic: true,
    },
  });

  // Add songs to playlists
  for (let i = 0; i < Math.min(20, allSongs.length); i++) {
    await prisma.playlistSong.create({
      data: {
        playlistId: likedPlaylist.id,
        songId: allSongs[i].id,
        position: i,
      },
    });
  }

  for (let i = 0; i < Math.min(15, allSongs.length); i++) {
    await prisma.playlistSong.create({
      data: {
        playlistId: discoverPlaylist.id,
        songId: allSongs[(i + 5) % allSongs.length].id,
        position: i,
      },
    });
  }

  // Create some likes
  for (let i = 0; i < 10; i++) {
    await prisma.like.create({
      data: {
        userId: freeUser.id,
        songId: allSongs[i].id,
      },
    });
  }

  // Create some follows
  await prisma.follow.create({
    data: {
      userId: freeUser.id,
      artistId: artists[0].id,
    },
  });

  await prisma.follow.create({
    data: {
      userId: premiumUser.id,
      artistId: artists[1].id,
    },
  });

  // Create notifications
  await prisma.notification.create({
    data: {
      userId: freeUser.id,
      type: 'new_release',
      message: 'Aurora Dreams released a new album!',
      link: '/album/1',
      read: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: freeUser.id,
      type: 'recommendation',
      message: 'Based on your listening, we think you\'ll love The Midnight Collective',
      link: '/artist/2',
      read: true,
    },
  });

  console.log('Database seeded successfully!');
  console.log('Users created:');
  console.log('  - admin@melodia.com (admin, premium)');
  console.log('  - user@melodia.com (user, free)');
  console.log('  - premium@melodia.com (user, premium)');
  console.log('Password for all users: password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
