import { Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProfileSidebar } from '../_components/profile-sidebar';
import { getUser, getUserQuestions } from './actions';
import UserNotFound from './_not-found';
import MainPageSkeleton from './loading';
import QuestionFeed from '../_components/question-feed';
import FloatingCard from '../_components/floating-card';

export default async function UserPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const user = await getUser((await params).name);
  if (!user) {
    return <UserNotFound />;
  }
  const questions = (await getUserQuestions(user.id)).map(q => ({
    ...q,
    authorId: q.authorId ?? undefined
  }));
  return (
    <>
      <Suspense fallback={<MainPageSkeleton />}>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
          <div className="mx-auto max-w-7xl px-4 py-8">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div className="grid gap-6 md:grid-cols-[300px_1fr]">
            <ProfileSidebar
              user={
                { 
                  name: user.username,
                  avatar: user.profilePicture || '' , 
                  bio: user.bio || '',
                  socials: user.socials || [] 
                }
              }
            />
            <QuestionFeed
              questions={questions}
              user={{
                username: user.username,
                avatar: user.profilePicture || '',
              }}
              answers={[]}
            />
            <FloatingCard id={user.id} />
            </div>
          </div>
        </div>
      </Suspense>
    </>
  );
}

