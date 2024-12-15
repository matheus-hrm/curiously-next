import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import Link from 'next/link';
import AnswersWrapper from './answer-wrapper';
import ReplyQuestion from './reply-question';

type QuestionCardProps = {
  question: {
    id: string;
    content: string;
    sender?: {
      name: string;
      profilePicture: string;
    };
    isAnonymous: boolean;
    createdAt: Date;
  };
  answerCount: number;
  canReply: boolean;
  answers: Answer[];
};

type Answer = {
  id: string;
  content: string;
  questionId: string;
  username: string;
  profilePicture: string;
};

export default function QuestionCard({
  question,
  answerCount,
  canReply,
  answers,
}: QuestionCardProps) {
  const isAnonymous = !question.sender || question.isAnonymous;
  return (
    <>
      {answerCount <= 0 && !canReply ? null : (
        <>
          <div className="flex items-start gap-4 mb-2">
            <Avatar>
              {isAnonymous ? (
                <User className="h-10 w-10 text-black/60" />
              ) : (
                <AvatarImage
                  src={question.sender?.profilePicture}
                  alt={question.sender?.name}
                />
              )}
            </Avatar>

            <div className="flex-1">
              {!isAnonymous && (
                <Link href={`/${question.sender?.name}`}>
                  <h3 className="font-extralight text-sm text-black/60 mb-1 hover:underline">
                    {question.sender?.name}
                  </h3>
                </Link>
              )}
              {isAnonymous && (
                <h3 className="font-extralight text-sm text-black/60 mb-1">
                  Anônimo
                </h3>
              )}
              <p className="text-black">{question.content}</p>
              <div className="flex flex-row items-center justify-start gap-4">
                {answerCount > 0 ? (
                  <AnswersWrapper
                    answers={answers}
                    count={answerCount}
                    question={question}
                    canReply={canReply}
                  />
                ) : (
                  canReply && <ReplyQuestion question={question} />
                )}
              </div>
            </div>
          </div>
          <div className="inset-0 flex items-center">
            <span className="w-full border-t mt-2 mr-2" />
          </div>
        </>
      )}
    </>
  );
}
