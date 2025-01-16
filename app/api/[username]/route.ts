import { getUser } from '@/app/(user)/[username]/actions';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  res: NextResponse,
  { params }: { params: Promise<{ username: string }> },
) {
  const username = (await params).username;
  if (!username) {
    return NextResponse.json(
      {
        error: 'Missing username',
      },
      {
        status: 400,
      },
    );
  }
  const session = await auth();
  if (session == null) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const user = session.user as { username: string };
  if (user.username !== username) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const user = await getUser(username);

    if (!user) {
      return NextResponse.json(
        {
          error: 'User not found',
        },
        {
          status: 404,
        },
      );
    }

    if (user.profilePicture && user.username && user.name && user.bio) {
      return NextResponse.json(
        {
          avatar: user.profilePicture,
          username: user.username,
          name: user.name,
          bio: user.bio,
        },
        {
          status: 200,
        },
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 },
    );
  } catch (error) {
    console.error('Error fetching user', error);

    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 },
    );
  }
}
