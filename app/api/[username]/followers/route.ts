import { auth } from '@/lib/auth';
import { prisma } from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const username = (await params).username;
    if (!username) {
      return NextResponse.json({ error: 'Missing username' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { username: username },
      include: {
        followers: {
          include: {
            follower: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ followers: user.followers });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
