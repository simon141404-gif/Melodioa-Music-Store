export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ stats: { totalSongs: 5, totalArtists: 5, totalAlbums: 3, totalUsers: 1 }});
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
