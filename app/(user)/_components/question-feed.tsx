import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, User } from 'lucide-react';
import { getUser } from '../[username]/actions';

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
    user: string;
  }[];
};

export default async function QuestionFeed({
  questions,
  user,
  answers,
}: QuestionFeedProps) {
  const question = questions;
  console.log(questions);

  return (
    <div className="relative">
      <Card className="backdrop-blur-lg bg-white/80 border-none shadow-lg">
        <CardContent className="p-6">
          <div className="h-[calc(100vh-16rem)] overflow-y-auto pr-4">
            {question &&
              question.map((question) => (
                <div key={question.id} className="mb-8 last:mb-0">
                  <div className="flex items-start gap-4 mb-4">
                    {(async () => {
                      const sender = await getSenderData(question);
                      return sender ? (
                        <Avatar>
                          <AvatarImage
                            src={sender.profilePicture || ''}
                            alt={sender.username}
                          />
                          <AvatarFallback>{sender.username}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <User className="h-8 w-8" />
                      );
                    })()}
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{user.username}</h3>
                      <p className="text-gray-600">{question.content}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <Button variant="ghost" size="sm">
                          {answers.length >= 1 && (
                            <MessageCircle className="mr-1 h-4 w-4">
                              {answers.length}
                            </MessageCircle>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  {answers.map((answer) => (
                    <div key={answer.id} className="ml-12 pl-4 border-l">
                      <div className="flex items-start gap-4 mb-4">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.username} />
                          <AvatarFallback>{answer.user[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{answer.user}</h4>
                          <p className="text-gray-600">{answer.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
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
    const sender = await getUser(question.authorId);
    return sender;
  }
};
