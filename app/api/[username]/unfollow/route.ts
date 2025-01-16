'use server';
import { auth } from '@/lib/auth';
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

  const session = await auth();
  if (session == null) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const user = session.user as { id: string };

  if (user.id !== userId && user.id !== profileId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
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
