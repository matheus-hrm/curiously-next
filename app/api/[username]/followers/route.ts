import { prisma } from '@/prisma/prisma';

export async function GET({ params }: { params: Promise<{ userId: string }> }) {
  const userId = (await params).userId;
  const followers = await getFollowers(userId);

  return {
    followers,
  };
}

export async function getFollowers(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      followers: {
        include: {
          follower: true,
        },
      },
    },
  });

  const followers = user?.followers.map((follower) => follower.follower);

  return followers;
}
