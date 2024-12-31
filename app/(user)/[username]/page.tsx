import { Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAllAnswers, getUser, getUserQuestions } from './actions';
import UserNotFound from './_not-found';
import MainPageSkeleton from './loading';
import QuestionFeed from '../_components/_questions-card/question-feed';
import FloatingCard from '../_components/floating-card';
import LogoutButton from '../_components/logout-button';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import UserSidebar from '../_components/_user-sidebar/user-sidebar-client';

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const user = await getUser((await params).username);
  if (!user) {
    return <UserNotFound />;
  }
  console.log(user)
  const session = await auth();
  const loggedUser = session?.user;
  const questions = await getUserQuestions(user.id);
  const answers = await getAllAnswers(user.id);
  const following = await getFollowingUsers(user.username);
  const followers = await getFollowers(user.username);

  return (
    <>
      <Suspense fallback={<MainPageSkeleton />}>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
          <div className="mx-auto max-w-7xl px-4 py-8">
            <Button variant="ghost" className="mb-6 hover:bg-black/20">
              <Link href={'/'} className="flex flex-row items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Link>
            </Button>
            <div className="grid gap-6 md:grid-cols-[300px_1fr]">
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
            <LogoutButton />
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
