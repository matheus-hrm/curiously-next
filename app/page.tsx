import { Card, CardContent } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { getUserById } from './(user)/[username]/actions';
import { getFollowingUsers } from './api/[username]/following/route';
import { prisma } from '@/prisma/prisma';
import { Input } from '@/components/ui/input';
import { Bell } from 'lucide-react';

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

export async function Home({ feed }: { feed: Feed }) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between items-center">
        <div className="">
          <p>Logo</p>
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
      <div className="">
        {feed &&
          feed.map((answer) => (
            <Card key={answer.id}>
              <CardContent>
                <div className="flex flex-row items-center space-x-2">
                  <img
                    src={answer.author.profilePicture}
                    alt="profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex flex-col">
                    <p>{answer.author.name}</p>
                    <p>{answer.author.username}</p>
                  </div>
                </div>
                <div className="flex flex-col">
                  <p>{answer.content}</p>
                  <p>{answer.createdAt}</p>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}

export default async function HomePage() {
  const user = await getUserPage();
  if (!user) return <div>Landing Page</div>;
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
