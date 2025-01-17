'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get('username');

  const session = (await auth()) as { user?: { username: string } };

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  console.log(session.user);

  if (session.user.username !== username) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  if (!username) {
    return NextResponse.json(
      {
        error: 'Missing username in query params',
      },
      { status: 400 },
    );
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      username: username,
    },
    include: {
      receivedQuestions: true,
    },
  });
  if (!dbUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  const questions = dbUser?.receivedQuestions.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );

  return NextResponse.json({ questions });
}
