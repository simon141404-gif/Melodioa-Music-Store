export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    return NextResponse.json({ success: true, isLiked: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to like song' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    return NextResponse.json({ success: true, isLiked: false });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to unlike song' }, { status: 500 });
  }
}
