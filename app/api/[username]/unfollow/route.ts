'use server';
import { prisma } from '@/prisma/prisma';

export async function POST({
  params,
}: {
  params: Promise<{ userId: string; followId: string }>;
}) {
  const { userId, followId } = await params;
  const result = await unfollowUser(userId, followId);
  return result;
}

export async function unfollowUser(followerId: string, followingId: string) {
  if (followerId === followingId) {
    throw new Error('You cannot unfollow yourself');
  }

  const follow = await prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });

  return follow;
}
