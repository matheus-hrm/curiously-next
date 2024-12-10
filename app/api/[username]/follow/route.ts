'use server';
import { prisma } from '@/prisma/prisma';

export async function POST({
  params,
}: {
  params: Promise<{ userId: string; followId: string }>;
}) {
  const { userId, followId } = await params;
  const follow = await followUser(userId, followId);
  return {
    follow,
  };
}

export async function followUser(followerId: string, followingId: string) {
  if (followerId === followingId) {
    throw new Error('You cannot follow yourself');
  }

  const follow = await prisma.follow.create({
    data: {
      followerId,
      followingId,
    },
  });

  return follow;
}
