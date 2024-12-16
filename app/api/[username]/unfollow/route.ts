'use server';
import { prisma } from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const unfollowUserSchema = z.object({
  userId: z.string(),
  profileId: z.string(),
});

export async function POST(Request: NextRequest) {
  const body = await Request.json();
  const { userId, profileId } = unfollowUserSchema.parse(body);

  if (!userId || !profileId) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const follow = await unfollowUser(profileId, userId);

  return NextResponse.json({ follow });
}

async function unfollowUser(followerId: string, followingId: string) {
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
