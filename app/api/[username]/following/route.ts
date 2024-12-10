import { prisma } from '@/prisma/prisma';
import { NextResponse } from 'next/server';

export async function GET({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const following = getFollowingUsers(id);
  return NextResponse.json({ following }, { status: 200 });
}

export async function getFollowingUsers(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      following: {
        include: {
          following: true,
        },
      },
    },
  });
  const following = user?.following.map((follow) => follow.following);
  return following;
}
