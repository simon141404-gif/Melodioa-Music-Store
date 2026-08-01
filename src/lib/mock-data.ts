// Large-scale music database with 1M+ songs (lazy loaded)
const artistData = [
  { id: '1', name: 'The Weeknd', imageUrl: 'https://i.scdn.co/image/ab6761610000e5ebc4c7c8a1d3a7e4c5e5d4c5e', bio: 'Canadian singer-songwriter', monthlyListeners: 90000000 },
  { id: '2', name: 'Taylor Swift', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb1c3d7e4c5e5d4c5e5d4c5e', bio: 'American singer-songwriter', monthlyListeners: 95000000 },
  { id: '3', name: 'Ed Sheeran', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb2c4d7e5c6f5d4c5e5d4c5e', bio: 'British singer-songwriter', monthlyListeners: 88000000 },
  { id: '4', name: 'Dua Lipa', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb3c5d8e6f7d5e4c5e5d4c5e', bio: 'British-Albanian singer', monthlyListeners: 82000000 },
  { id: '5', name: 'Drake', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb4c6d9e7f8e6d5e4c5e5d4c5e', bio: 'Canadian rapper', monthlyListeners: 85000000 },
  { id: '6', name: 'Bad Bunny', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb5c7d0e8f9e7d6e5d4c5e5d4c5e', bio: 'Puerto Rican rapper', monthlyListeners: 78000000 },
  { id: '7', name: 'BTS', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb6c8d1e9f0e8d7e6d5e4c5e5d4c5e', bio: 'South Korean boy band', monthlyListeners: 72000000 },
  { id: '8', name: 'Ariana Grande', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb7c9d2e0f1e9d8e7d6e5d4c5e5d4c5e', bio: 'American singer', monthlyListeners: 80000000 },
  { id: '9', name: 'Justin Bieber', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb8c0d3e1f2e0d9e8d7e6d5e4c5e5d4c5e', bio: 'Canadian singer', monthlyListeners: 75000000 },
  { id: '10', name: 'Billie Eilish', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb9c1d4e2f3e1d0e9d8e7d6e5d4c5e5d4c5e', bio: 'American singer', monthlyListeners: 70000000 },
  { id: '11', name: 'Post Malone', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb0c2d5e3f4e2d1e0d9e8d7e6d5e4c5e5d4c5e', bio: 'American rapper', monthlyListeners: 68000000 },
  { id: '12', name: 'Eminem', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb1c3d6e4f5e3d2e1d0e9d8e7d6e5d4c5e5d4c5e', bio: 'American rapper', monthlyListeners: 72000000 },
  { id: '13', name: 'Bruno Mars', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb2c4d7e5f6e4d3e2d1e0d9e8d7e6d5e4c5e5d4c5e', bio: 'American singer', monthlyListeners: 65000000 },
  { id: '14', name: 'Rihanna', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb3c5d8e6f7e5d4e3d2d1e0d9e8d7e6d5e4c5e5d4c5e', bio: 'Barbadian singer', monthlyListeners: 62000000 },
  { id: '15', name: 'Beyonce', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb4c6d9e7f8e6d5e4d3e2d1e0d9e8d7e6d5e4c5e5d4c5e', bio: 'American singer', monthlyListeners: 70000000 },
  { id: '16', name: 'Harry Styles', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb5c7d0e8f9e7d6e5d4e3d2d1e0d9e8d7e6d5e4c5e5d4c5e', bio: 'British singer', monthlyListeners: 68000000 },
  { id: '17', name: 'Shawn Mendes', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb6c8d1e9f0e8d7e6d5e4d3e2d1e0d9e8d7e6d5e4c5e5d4c5e', bio: 'Canadian singer', monthlyListeners: 55000000 },
  { id: '18', name: 'Selena Gomez', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb7c9d2e0f1e9d8e7d6e5e4d3e2d1e0d9e8d7e6d5e4c5e5d4c5e', bio: 'American singer', monthlyListeners: 58000000 },
  { id: '19', name: 'Katy Perry', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb8c0d3e1f2e0d9e8d7e6f5e4d3e2d1e0d9e8d7e6d5e4c5e5d4c5e', bio: 'American singer', monthlyListeners: 52000000 },
  { id: '20', name: 'Lady Gaga', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb9c1d4e2f3e1d0e9d8e7f6e5d4e3e2d1e0d9e8d7e6d5e4c5e5d4c5e', bio: 'American singer', monthlyListeners: 60000000 },
  { id: '21', name: 'Coldplay', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb0c1d4e2f3e1d0e9d8e7f6e5d4c5e5d4c5e', bio: 'British rock band', monthlyListeners: 58000000 },
  { id: '22', name: 'Imagine Dragons', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb1c2d5e3f4e2d1e0d9e8d7e6d5e4c5e5d4c5e', bio: 'American rock band', monthlyListeners: 55000000 },
  { id: '23', name: 'Maroon 5', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb2c3d6e4f5e3d2e1d0e9d8e7d6e5d4c5e5d4c5e', bio: 'American pop band', monthlyListeners: 52000000 },
  { id: '24', name: 'The Chainsmokers', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb3c4d7e5f6e4d3e2d1e0d9e8d7e6d5e4c5e5d4c5e', bio: 'American DJ duo', monthlyListeners: 48000000 },
  { id: '25', name: 'Calvin Harris', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb4c5d8e6f7e5d4e3d2d1e0d9e8d7e6d5e4c5e5d4c5e', bio: 'Scottish DJ', monthlyListeners: 50000000 },
];

const genres = ['Pop', 'Rock', 'Hip-Hop', 'R&B', 'Electronic', 'Country', 'Jazz', 'Classical', 'Latin', 'K-Pop', 'Indie', 'Metal', 'Folk', 'Blues', 'Reggae'];

const songTitles = [
  'Blinding Lights', 'Save Your Tears', 'Anti-Hero', 'Shape of You', 'Levitating', 'Starboy', 'Cruel Summer', 'Perfect', 'New Rules', 'One Dance',
  'Bad Guy', 'Old Town Road', 'Sunflower', 'Dance Monkey', 'Señorita', 'Watermelon Sugar', 'Adore You', 'Circles', 'Someone You Loved', 'Rockstar',
  'Stay', 'Good 4 U', 'Montero', 'Peaches', 'Kiss Me More', 'Leave The Door Open', 'Heat Waves', 'Easy On Me', 'Shivers', 'All I Want',
  'Happier Than Ever', 'Deja Vu', 'Drivers License', 'Forever After All', 'Back in Blood', 'Jalebi Baby', 'Mothership', 'Butter', 'Dynamite', 'Permission to Dance',
  'Mood', 'Industry Baby', 'Just Wanna Rock', 'Heat It Up', 'Super Freaky Girl', 'About Damn Time', 'First Class', 'Ghost', 'Enemy', 'Heat Waves',
];

function getSongById(id: number) {
  const titleIndex = (id - 1) % songTitles.length;
  const artistIndex = (id - 1) % artistData.length;
  const genre = genres[(id - 1) % genres.length];
  const year = 2015 + ((id - 1) % 10);
  
  return {
    id: String(id),
    title: `${songTitles[titleIndex]} ${Math.floor((id - 1) / songTitles.length) + 1}`,
    artist: { id: artistData[artistIndex].id, name: artistData[artistIndex].name },
    album: {
      id: `album-${Math.floor((id - 1) / 10) + 1}`,
      title: `Album ${Math.floor((id - 1) / 10) + 1}`,
      artist: { id: artistData[artistIndex].id, name: artistData[artistIndex].name },
      coverUrl: `https://i.scdn.co/image/ab67616d0000b273${String((id * 7) % 999999999999).padStart(12, '0')}`,
      releaseYear: year,
    },
    duration: 150 + ((id * 13) % 180),
    genre,
    coverUrl: `https://i.scdn.co/image/ab67616d0000b273${String((id * 7) % 999999999999).padStart(12, '0')}`,
    audioUrl: '/music/sample.mp3',
    lyrics: null,
    plays: (id * 1234567) % 100000000,
    releaseDate: `${year}-01-01`,
  };
}

// Lazy loaded songs - only generate what we need
export function getSongs(page: number = 1, limit: number = 20) {
  const start = (page - 1) * limit;
  const songs = [];
  for (let i = start; i < start + limit; i++) {
    songs.push(getSongById(i + 1));
  }
  return songs;
}

export function searchSongs(query: string, limit: number = 50) {
  const q = query.toLowerCase();
  const results: any[] = [];
  const maxSearch = 1000000; // Search first 1M songs
  
  for (let i = 1; i <= maxSearch && results.length < limit; i++) {
    const song = getSongById(i);
    if (song.title.toLowerCase().includes(q) || song.artist.name.toLowerCase().includes(q)) {
      results.push(song);
    }
  }
  return results;
}

export function searchArtists(query: string, limit: number = 20) {
  const q = query.toLowerCase();
  return artistData.filter(a => a.name.toLowerCase().includes(q)).slice(0, limit).map(artist => ({
    ...artist,
    albums: [],
    monthlyListeners: artist.monthlyListeners + Math.floor(Math.random() * 10000000),
    isVerified: true,
  }));
}

export function searchAlbums(query: string, limit: number = 20) {
  const q = query.toLowerCase();
  const albums: any[] = [];
  for (let i = 1; i <= 500; i++) {
    const song = getSongById(i * 10);
    if (song.album.title.toLowerCase().includes(q) || song.artist.name.toLowerCase().includes(q)) {
      if (!albums.find(a => a.id === song.album.id)) {
        albums.push({
          ...song.album,
          songs: [],
          totalTracks: 10 + Math.floor(Math.random() * 5),
          genre: song.genre,
        });
      }
    }
    if (albums.length >= limit) break;
  }
  return albums;
}

// Default export for backward compatibility
export const mockSongs = Array.from({ length: 100 }, (_, i) => getSongById(i + 1));

export const mockArtists = artistData.map((artist, index) => ({
  ...artist,
  albums: [],
  monthlyListeners: artist.monthlyListeners + Math.floor(Math.random() * 10000000),
  isVerified: true,
}));

export const mockAlbums = Array.from({ length: 50 }, (_, i) => {
  const song = getSongById(i * 10 + 1);
  return {
    ...song.album,
    songs: [],
    totalTracks: 10 + Math.floor(Math.random() * 5),
    genre: song.genre,
  };
});

export const mockPlaylists = [
  { id: '1', name: 'Top Hits 2024', description: 'The hottest tracks right now', coverUrl: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36', songCount: 50, owner: 'Melodia' },
  { id: '2', name: 'Chill Vibes', description: 'Relax and unwind', coverUrl: 'https://i.scdn.co/image/ab67616d0000b273d4a5e5d4c5e5d4c5e5d4c5e5d4', songCount: 100, owner: 'Melodia' },
  { id: '3', name: 'Workout Mix', description: 'High energy tracks', coverUrl: 'https://i.scdn.co/image/ab67616d0000b273e5a6e5d4c5e5d4c5e5d4c5e5d4', songCount: 75, owner: 'Melodia' },
  { id: '4', name: 'Sleep Sounds', description: 'Calming music for sleep', coverUrl: 'https://i.scdn.co/image/ab67616d0000b273f6a7e5d4c5e5d4c5e5d4c5e5d4', songCount: 30, owner: 'Melodia' },
  { id: '5', name: 'Party Anthems', description: 'Best party songs', coverUrl: 'https://i.scdn.co/image/ab67616d0000b273a7b8e5d4c5e5d4c5e5d4c5e5d4', songCount: 60, owner: 'Melodia' },
];

// Export total count
export const TOTAL_SONGS = 1000000;

// Mock streams for admin
export const mockStreams = [
  { id: '1', songId: '1', userId: '1', createdAt: new Date(Date.now() - 5 * 60000) },
  { id: '2', songId: '2', userId: '1', createdAt: new Date(Date.now() - 15 * 60000) },
  { id: '3', songId: '3', userId: '1', createdAt: new Date(Date.now() - 25 * 60000) },
  { id: '4', songId: '4', userId: '1', createdAt: new Date(Date.now() - 35 * 60000) },
  { id: '5', songId: '5', userId: '1', createdAt: new Date(Date.now() - 45 * 60000) },
];
