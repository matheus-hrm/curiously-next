'use server';
import { auth } from '@/lib/auth';
import { prisma } from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const followUserSchema = z.object({
  userId: z.string(),
  profileId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, profileId } = followUserSchema.parse(body);

    const session = (await auth()) as { user?: { id: string } };

    if (!session?.user || session.user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    if (!userId || !profileId) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    const follow = await followUser(profileId, userId);

    return NextResponse.json({ follow });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

async function followUser(followerId: string, followingId: string) {
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
