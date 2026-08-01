export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getSongs } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    // Get songs for recommendations
    const songs = getSongs(1, 20);
    
    return NextResponse.json({ 
      madeForYou: songs.slice(0, 10),
      topCharts: songs.slice(5, 15),
      recentlyPlayed: songs.slice(10, 20)
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
  }
}
