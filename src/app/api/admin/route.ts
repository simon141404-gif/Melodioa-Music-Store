export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { mockSongs, mockArtists, mockAlbums, mockStreams } from '@/lib/mock-data';

export async function GET() {
  try {
    // Add more streams to show in dashboard
    const streams = [];
    for (let i = 0; i < 50; i++) {
      streams.push({
        id: String(i + 10),
        songId: String((i % 10) + 1),
        userId: String((i % 3) + 1),
        createdAt: new Date(Date.now() - 1000 * 60 * (i * 10)),
      });
    }
    
    return NextResponse.json({ 
      stats: { 
        totalSongs: 10, 
        totalArtists: 5, 
        totalAlbums: 6, 
        totalUsers: 1,
        totalStreams: 55
      },
      recentUsers: [],
      recentStreams: streams.slice(0, 5).map(s => {
        const song = mockSongs.find(song => song.id === s.songId);
        return {
          songTitle: song?.title || 'Unknown',
          artistName: song?.artist?.name || 'Unknown',
          playedAt: s.createdAt.toISOString()
        };
      })
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
