import ProfileTooltip from './(home)/_components/profile-tooltip';
import FeedAnswerCard from './(home)/_components/feed-card';
import { getUserById } from './(user)/[username]/actions';
import { MainLogo } from '@/components/main-logo';
import { Button } from '@/components/ui/button';
import SignInPage from './auth/signin/page';
import { prisma } from '@/prisma/prisma';
import { auth } from '@/lib/auth';
import Link from 'next/link';

type HomeProps = {
  feed: {
    id: string;
    content: string;
    createdAt: string;
    author: {
      id: string;
      name: string;
      username: string;
      profilePicture: string;
    };
    question: {
      id: string;
      content: string;
      createdAt: string;
      isAnonymous: boolean;
    };
  }[];
  user: {
    username: string;
    name: string;
    profilePicture: string;
  };
};

async function Home({ feed, user }: HomeProps) {
  return (
    <div className="flex flex-col bg-gradient-to-b from-[hsl(var(--background-cream))] to-[hsl(var(--background-darker-cream))] h-screen">
      <div className="flex flex-row justify-between items-center mb-24">
        <div className="">
          <MainLogo />
        </div>
        <div className="flex flex-row justify-center items-center m-4 space-x-4">
          <Button variant="default" className="outline-2">
            <Link
              href={`/${user.username}`}
              className="flex flex-row items-center"
            >
              <p>Meu perfil</p>
            </Link>
          </Button>
          <ProfileTooltip user={user} />
        </div>
      </div>
      <div className="flex flex-row justify-between items-start space-x-10 ">
        <div className="w-1/4"></div>
        <div className="flex flex-col w-2/4">
          <p className="text-xl mx-4 o">Feed</p>
          {feed.length > 0 ? (
            feed.map((answer) => (
              <FeedAnswerCard
                key={answer.id}
                sender={answer.author}
                answer={answer}
                follower={answer.author}
              />
            ))
          ) : (
            <p className="text-lg mt-10 text-center">Sem perguntas recentes</p>
          )}
        </div>
        <div className="w-1/4"></div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const user = await getUserPage();
  if (!user)
    return (
      <div>
        <MainLogo />
        <SignInPage />
      </div>
    );
  const feed = await GetHomePageFeed(user.id);
  return (
    <Home
      feed={feed}
      user={{
        name: user.name!,
        profilePicture: user.profilePicture!,
        username: user.username!,
      }}
    />
  );
}

const getUserPage = async () => {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;
  const user = getUserById(id);
  return user;
};

async function GetHomePageFeed(userId: string) {
  if (!userId) return [];

  const following = await getFollowingUsers(userId);
  if (!following) return [];

  const feed = await prisma.answer.findMany({
    where: {
      OR: [
        {
          authorId: {
            in: following.map((user) => user.id),
          },
        },
        {
          question: {
            isAnonymous: true,
          },
        },
      ],
    },
    include: {
      author: true,
      question: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return feed.map((answer) => ({
    ...answer,
    createdAt: answer.createdAt.toISOString(),
    author: {
      ...answer.author,
      profilePicture: answer.author.profilePicture || '',
    },
    question: {
      ...answer.question,
      createdAt: answer.question.createdAt.toISOString(),
    },
  }));
}

async function getFollowingUsers(userId: string) {
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
