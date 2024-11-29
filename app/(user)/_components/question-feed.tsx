import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle } from 'lucide-react';
import { getUser, getUserById } from '../[username]/actions';
import { auth } from '@/lib/auth';
import { User as UserType } from '@/app/types/user';
import ReplyQuestion from './reply-question';

type Question = {
  id: string;
  createdAt: Date;
  content: string;
  isAnonymous: boolean;
  authorId?: string | null;
  receiverId?: string;
};

type QuestionFeedProps = {
  questions: Question[] | undefined;
  user: {
    username: string;
    avatar: string;
  };
  answers: {
    id: string;
    content: string;
    questionId: string;
    userName: string;
    userProfilePicture: string;
  }[];
};

export default async function QuestionFeed({
  questions,
  user,
  answers,
}: QuestionFeedProps) {
  const owner = await IsProfileOwner(user.username);
  const joinSenderToQuestion = async (question: Question) => {
    const sender = await getSenderData(question);
    return {
      ...question,
      sender: sender
        ? {
            name: sender.name ?? '',
            profilePicture: sender.profilePicture ?? '',
          }
        : undefined,
    };
  };
  const questionsWithSender = questions
    ? await Promise.all(questions.map(joinSenderToQuestion))
    : [];

  return (
    <div className="relative">
      <Card className="backdrop-blur-lg bg-white/80 border-none shadow-lg">
        <CardContent className="p-6">
          <div className="h-[calc(100vh-16rem)] overflow-y-auto pr-4">
            {questionsWithSender.map((question) => (
              <div key={question.id} className="mb-8 last:mb-0 ">
                <div className="flex items-start gap-4 mb-2">
                  {question.sender && (
                    <Avatar>
                      <AvatarImage
                        src={question.sender?.profilePicture || ''}
                        alt={question.sender.name || 'Unknown'}
                      />
                      <AvatarFallback>{question.sender.name}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{user.username}</h3>
                    <p className="text-gray-600">{question.content}</p>
                    {answers.filter(
                      (answer) => answer.questionId === question.id,
                    ).length > 0 && (
                      <div className="flex items-center gap-4 mt-2">
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="mr-1 h-4 w-4" />
                          {
                            answers.filter(
                              (answer) => answer.questionId === question.id,
                            ).length
                          }
                        </Button>
                      </div>
                    )}
                  </div>
                  {owner && <ReplyQuestion question={question} />}
                </div>
                {answers.map((answer) =>
                  answer.questionId !== question.id ? null : (
                    <div key={answer.id} className="ml-12 pl-6 border-l">
                      <div className="flex items-start gap-2 mb-2">
                        <Avatar>
                          <AvatarImage
                            src={answer.userProfilePicture}
                            alt={answer.userName}
                          />
                        </Avatar>
                        <div className="flex flex-col justify-center items-start ml-2">
                          <h4 className="font-semibold mb-1">
                            {answer.userName}
                          </h4>
                          <p className="text-gray-600">{answer.content}</p>
                        </div>
                      </div>
                    </div>
                  ),
                )}
                <div className="inset-0 flex items-center">
                  <span className="w-full border-t mt-4" />
                </div>
              </div>
            ))}
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
