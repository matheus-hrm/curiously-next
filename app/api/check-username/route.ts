import { prisma } from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(Request: NextRequest) {
  const { username } = await Request.json();

  if (!username) {
    return NextResponse.json({ error: 'Missing username' }, { status: 400 });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    return NextResponse.json({ isUnique: !existingUser }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to check username' },
      { status: 500 },
    );
  }
}
