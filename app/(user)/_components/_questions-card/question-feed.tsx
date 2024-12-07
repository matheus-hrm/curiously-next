import { Card, CardContent } from '@/components/ui/card';
import AnswerCard from './answer-card';
import { getUser, getUserById } from '../../[username]/actions';
import { auth } from '@/lib/auth';
import { User as UserType } from '@/app/types/user';
import QuestionCard from './question-card';

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

  const questionsWithSender = questions
    ? await Promise.all(
        questions.map(async (questions) => {
          const sender = await getSenderData(questions);
          return {
            ...questions,
            sender: sender
              ? {
                  name: sender.name ?? '',
                  profilePicture: sender.profilePicture ?? '',
                }
              : undefined,
          };
        }),
      )
    : [];

  return (
    <div className="relative">
      <Card className="backdrop-blur-lg bg-white/80 border-none shadow-lg">
        <CardContent className="p-6">
          <div className="h-[calc(100vh-16rem)] overflow-y-auto pr-4">
            {questionsWithSender.map((question) => {
              const questionAnswers = answers.filter(
                (answer) => answer.questionId === question.id,
              );
              return (
                <div key={question.id} className="mb-8 last:mb-0">
                  <QuestionCard
                    question={question}
                    answerCount={questionAnswers.length}
                    canReply={owner}
                    answers={questionAnswers}
                  />

                  <div className="inset-0 flex items-center">
                    <span className="w-full border-t mt-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const getSenderData = async (question: Question) => {
  if (question.authorId) {
    const sender = await getUserById(question.authorId);
    return sender;
  }
};

const IsProfileOwner = async (username: string) => {
  const session = await auth();
  const loggedUser = session?.user as UserType;
  const dbUser = await getUser(username);
  if (!loggedUser || !dbUser) return false;
  return loggedUser.id === dbUser.id;
};
