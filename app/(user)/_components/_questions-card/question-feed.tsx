import { Card, CardContent } from '@/components/ui/card';
import { getUser } from '../../[username]/actions';
import { auth } from '@/lib/auth';
import { User as UserType } from '@/app/types/user';
import QuestionFeedClient from './question-feed-client';

type QuestionFeedProps = {
  questions: Question[];
  user: {
    username: string;
    avatar: string;
  };
  answers: Answer[];
};

type Question = {
  id: string;
  content: string;
  authorId?: string | null;
  isAnonymous: boolean;
  createdAt: Date;
};

type Answer = {
  id: string;
  content: string;
  questionId: string;
  username: string;
  profilePicture: string;
};

export default async function QuestionFeed({
  questions,
  user,
  answers,
}: QuestionFeedProps) {
  const owner = await IsProfileOwner(user.username);

  return (
    <div className="relative">
      <Card className="backdrop-blur-lg bg-white/80 border-none shadow-lg">
        <CardContent className="p-6">
          <div className="h-[calc(100vh-16rem)] overflow-y-auto pr-4">
            <QuestionFeedClient
              initialQuestions={questions}
              initialAnswers={answers}
              user={user}
              owner={owner}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const IsProfileOwner = async (username: string) => {
  const session = await auth();
  const loggedUser = session?.user as UserType;
  const dbUser = await getUser(username);
  if (!loggedUser || !dbUser) return false;
  return loggedUser.id === dbUser.id;
};
