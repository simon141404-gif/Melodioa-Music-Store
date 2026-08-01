export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ streams: [] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch streams' }, { status: 500 });
  }
}
