export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { mockArtists } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    return NextResponse.json({ artists: mockArtists.slice(0, limit) });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch artists' }, { status: 500 });
  }
}
