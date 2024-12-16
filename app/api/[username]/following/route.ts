import { prisma } from '@/prisma/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const username = (await params).username;
    const user = await prisma.user.findUnique({
      where: { username: username },
      include: {
        following: {
          include: {
            following: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ following: user.following });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
