import { prisma } from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ username: string; id: string }> },
) {

  const { username, id } = await params;
  const session = await auth();
  if (session == null) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const user = session.user as { username: string };

  if (user.username !== username) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  if (!id) {
    return NextResponse.json({ error: 'Missing question ID' }, { status: 400 });
  }

  try {
    const question = await prisma.question.delete({
      where: {
        id,
      },
    });

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: 'Question deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error deleting question', error);
    return NextResponse.json(
      { error: 'Failed to delete question' },
      { status: 500 },
    );
  }
}
