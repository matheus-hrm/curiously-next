import { prisma } from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ username: string; id: string }> },
) {
  const id = (await params).id;
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
