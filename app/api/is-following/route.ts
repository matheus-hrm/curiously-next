import { auth } from '@/lib/auth';
import { prisma } from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const profileId = searchParams.get('profileId');

    const session = await auth();
    if (session == null) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const sessionUser = session.user as { id: string };
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (sessionUser.id !== userId && sessionUser.id !== profileId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (!userId || !profileId) {
      return NextResponse.json({ isFollowing: false });
    }

    const isFollowing = await isUserFollowing(
      userId as string,
      profileId as string,
    );
    return NextResponse.json({ isFollowing: isFollowing });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to check following status: ${error}` },
      { status: 500 },
    );
  }
}

async function isUserFollowing(userId: string, profileId: string) {
  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: profileId as string,
        followingId: userId as string,
      },
    },
  });
  return !!follow;
}
