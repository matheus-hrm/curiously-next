import { prisma } from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const profileId = searchParams.get('profileId');
  if (!userId) {
    return { isFollowing: false };
  }
  const isFollowing = await isUserFollowing(
    userId as string,
    profileId as string,
  );
  if (isFollowing) {
    return NextResponse.json({ isFollowing: true });
  } else {
    return NextResponse.json({ isFollowing: false });
  }
}

async function isUserFollowing(userId: string, profileId: string) {
  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: userId as string,
        followingId: profileId as string,
      },
    },
  });
  if (follow) {
    return true;
  }
  return false;
}
