import { prisma } from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(3).max(20).optional(),
  bio: z.string().optional(),
  socials: z.array(z.string().url()).optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  const username = (await params).username;
  try {
    const body = await req.json();
    const validatedData = updateProfileSchema.parse(body);
    console.log(username)
    const updatedUser = await prisma.user.update({
      where: {
        username: username,
      },
      data: {
        ...(validatedData.name && { name: validatedData.name }),
        ...(validatedData.bio && { bio: validatedData.bio }),
        ...(validatedData.socials && { socials: validatedData.socials }),
      },
    });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error('Error updating user profile', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 },
    );
  }
}
