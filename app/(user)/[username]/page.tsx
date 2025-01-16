import { Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';
import { Metadata } from 'next';
import Link from 'next/link';
import UserNotFound from './_not-found';
import MainPageSkeleton from './loading';
import QuestionFeed from '../_components/_questions-card/question-feed';
import FloatingCard from '../_components/floating-card';
import UserSidebar from '../_components/_user-sidebar/user-sidebar-client';
import Settings from '../_components/settings';
import {
  getAllAnswers,
  getQuestionById,
  getUser,
  getUserQuestions,
} from './actions';
import { MainLogo } from '@/components/main-logo';
import Footer from '@/components/footer';

type Props = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
  params: Promise<{ username: string }>;
};

export async function generateMetadata({
  searchParams,
  params,
}: Props): Promise<Metadata> {
  const username = (await params).username;
  const user = await getUser(username);
  const highlight = (await searchParams)?.highlight as string;
  const question = highlight ? await getQuestionById(highlight) : null;

  const profileMetadata: Metadata = {
    title: `${user?.name} (@${user?.username}) / Curiously`,
    description: user?.bio || '',
    openGraph: {
      title: `${user?.name} (@${user?.username}) / Curiously`,
      description: user?.bio || '',
      images: [
        {
          url: `https://curiously.vercel.app/api/og/?u=${user?.username}`,
          width: 1200,
          height: 630,
          alt: `${user?.name} (@${user?.username})`,
        },
      ],
    },
  };
  const questionMetadata: Metadata = {
    title: `Curiously`,
    description: question?.content || 'Check out this question!',
    openGraph: {
      title: `question`,
      description: question?.content || 'Check out this question!',
      images: [
        {
          url: `https://curiously.vercel.app/api/og/question?q=${encodeURIComponent(
            question?.content || '',
          )}`,
          width: 1200,
          height: 630,
          alt: `question`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `question`,
      description: question?.content || 'Check out this question!',
      images: [
        {
          url: `https://curiously.vercel.app/api/og/question?q=${encodeURIComponent(
            question?.content || '',
          )}`,
          width: 1200,
          height: 630,
          alt: `question`,
        },
      ],
    },
  };
  return highlight ? questionMetadata : profileMetadata;
}

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const user = await getUser((await params).username);
  if (!user) {
    return <UserNotFound />;
  }
  const session = await auth();
  const loggedUser = session?.user as {
    id: string;
    username: string;
    name: string;
    email: string;
  };

  const questions = await getUserQuestions(user.id);
  const answers = await getAllAnswers(user.id);
  const following = await getFollowingUsers(user.username);
  const followers = await getFollowers(user.username);

  return (
    <>
      <Suspense fallback={<MainPageSkeleton />}>
        <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--background-cream))] to-[hsl(var(--background-darker-cream))]">
          <div className=" sm:fixed sm:w-auto">
            <MainLogo size={110} />
          </div>
          <div className="mx-auto max-w-7xl px-4 py-4 sm:py-8">
            <div className="flex flex-row items-center space-x-2">
              <Button variant="outline" className="outline-2">
                <Link href={'/'} className="flex flex-row items-center">
                  <ArrowLeft className="mr-2 h-4 w-4 " />
                  Voltar
                </Link>
              </Button>
              <div className="flex item-center justify-center">
                {loggedUser && loggedUser.id === user.id && (
                  <Settings username={loggedUser.username} />
                )}
                {!loggedUser && (
                  <Button variant="link" className=" bg-black text-white ml-2">
                    <Link href={'/auth/signin'}>Login</Link>
                  </Button>
                )}
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-[300px_1fr]">
              <div className="flex flex-col  w-full ">
                <UserSidebar
                  user={{
                    name: user.name,
                    id: user.id,
                    username: user.username,
                    avatar: user.profilePicture || '',
                    bio: user.bio || '',
                    socials: user.socials || [],
                    followers: followers || [],
                    following: following || [],
                  }}
                  isLogged={loggedUser?.id === user.id}
                  loggedUserId={loggedUser?.id}
                />
                <div className="hidden md:flex md:h-full md:mt-10 md:flex-col md:justify-between md:space-y-5 md:text-center">
                  <Footer />
                  <Link
                    target={'_blank'}
                    href={'https://github.com/matheus-hrm'}
                  >
                    <p className="text-sm  text-stone-600/60">
                      desenvolvido por{' '}
                      <u className="no-underline hover:underline">
                        matheus-hrm
                      </u>
                    </p>
                  </Link>
                </div>
              </div>
              <QuestionFeed
                questions={questions}
                user={{
                  username: user.username,
                  avatar: user.profilePicture || '',
                }}
                answers={answers.map((answer) => ({
                  id: answer.id,
                  content: answer.content,
                  questionId: answer.questionId,
                  username: answer.user.name,
                  profilePicture: answer.user.profilePicture,
                }))}
              />

              {loggedUser ? (
                <FloatingCard
                  receiverId={user.id}
                  loggedUserId={loggedUser.id}
                />
              ) : (
                <FloatingCard receiverId={user.id} loggedUserId={null} />
              )}
            </div>
            {/* Mobile footer */}
            <div className="md:hidden mb-20 md:mb-0 mt-10 flex flex-col justify-between space-y-5 text-center">
              <Footer />
              <Link target={'_blank'} href={'https://github.com/matheus-hrm'}>
                <p className="text-sm text-stone-600/60">
                  desenvolvido por{' '}
                  <u className="no-underline hover:underline">matheus-hrm</u>
                </p>
              </Link>
            </div>
          </div>
        </div>
      </Suspense>
    </>
  );
}

async function getFollowingUsers(username: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/${username}/following`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch following');
    }

    const data = await response.json();
    return data.following || [];
  } catch (error) {
    console.error('Error fetching following:', error);
    return [];
  }
}

async function getFollowers(username: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/${username}/followers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch followers');
    }

    const data = await response.json();
    return data.followers || [];
  } catch (error) {
    console.error('Error fetching followers:', error);
    return [];
  }
}
