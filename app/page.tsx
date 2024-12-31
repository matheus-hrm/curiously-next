import { auth } from '@/lib/auth';
import { getUserById } from './(user)/[username]/actions';
import { prisma } from '@/prisma/prisma';
import { Input } from '@/components/ui/input';
import { Bell } from 'lucide-react';
import FeedAnswerCard from './(home)/_components/feed-card';
import { MainLogo } from '@/components/main-logo';
import SignInPage from './auth/signin/page';

type Feed = {
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
  };
}[];

async function Home({ feed }: { feed: Feed }) {
  return (
    <div className="flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="flex flex-row justify-between items-center mb-24">
        <div className="">
          <MainLogo />
        </div>
        <div className="flex flex-row justify-center items-center m-4 space-x-4">
          <Input
            type="text"
            placeholder="Search"
            className="border-2 border-gray-300 rounded-lg p-2"
          ></Input>
          <Bell className="w-6 h-6" />
        </div>
      </div>
      <div className="flex flex-row justify-between items-start space-x-10">
        <div className="w-1/4">
          <p>Left Sidebar</p>
        </div>
        <div className="flex flex-col w-2/4">
          {feed && <p className="text-2xl mx-4 overflow-y-auto">Feed</p> &&
            feed.map((answer) => (
              <FeedAnswerCard
                key={answer.id}
                sender={answer.author}
                answer={answer}
                follower={answer.author}
              />
            ))}
          {!feed && <p className="text-2xl mx-4">Sem perguntas recentes</p>}
        </div>
        <div className="w-1/4">
          <p>Right Sidebar</p>
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const user = await getUserPage();
  if (!user) return (<div><SignInPage/></div>);
  const feed = await GetHomePageFeed(user.id);
  return <Home feed={feed} />;
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
      authorId: {
        in: following.map((user) => user.id),
      },
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
