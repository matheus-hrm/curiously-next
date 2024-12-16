import { prisma } from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const profileId = searchParams.get('profileId');

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
