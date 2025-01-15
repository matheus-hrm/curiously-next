import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import Link from 'next/link';
import AnswersWrapper from './answer-wrapper';
import ReplyQuestion from './reply-question';
import ShareButton from './share-button';
import DeleteQuestion from './delete-question';

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
  owner: boolean;
  answers: Answer[];
  username: string;
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
  owner,
  answers,
  username,
}: QuestionCardProps) {
  const isAnonymous = !question.sender || question.isAnonymous;

  return (
    <>
      {answerCount <= 0 && !owner ? null : (
        <>
          <div
            id={`question-${question.id}`}
            className="flex items-start gap-4 mb-2 group"
          >
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
              <div className="flex flex-row items-center justify-between">
                <p className="text-black mb-2 py-1">{question.content}</p>
                <div className="sm:visible md:group-hover:visible transition-all">
                  {owner ? (
                    <DeleteQuestion
                      questionId={question.id}
                      username={username}
                      onClose={() => {}}
                    />
                  ) : (
                    <p className="my-0.5"> </p>
                  )}
                </div>
              </div>
              <div className="flex flex-row items-center gap-2 sm:gap-4">
                {answerCount > 0 ? (
                  <AnswersWrapper
                    answers={answers}
                    count={answerCount}
                    question={question}
                    canReply={owner}
                    username={username}
                  />
                ) : (
                  owner && (
                    <>
                      <ReplyQuestion question={question} />
                      <ShareButton
                        question={question}
                        username={username}
                        answers={answers}
                      />
                    </>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="inset-0 flex items-center ">
            <span className="w-full border-t mt-2 mr-2" />
          </div>
        </>
      )}
    </>
  );
}
