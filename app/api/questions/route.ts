'use server';

import { prisma } from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
    include: {
      receivedQuestions: true,
    },
  });
  const questions = user?.receivedQuestions.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );

  return NextResponse.json({ questions });
}
