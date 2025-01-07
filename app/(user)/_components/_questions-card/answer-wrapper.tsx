'use client';

import { useState } from 'react';
import HideAnswersButton from './hide-answers-button';
import AnswerCard from './answer-card';
import ReplyQuestion from './reply-question';
import ShareButton from './share-button';

type Answer = {
  id: string;
  content: string;
  questionId: string;
  username: string;
  profilePicture: string;
};

type AnswersSectionProps = {
  answers: Answer[];
  count: number;
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
  canReply: boolean;
  username: string;
};

export default function AnswersWrapper({
  answers,
  count,
  question,
  canReply,
  username,
}: AnswersSectionProps) {
  const [showAnswers, setShowAnswers] = useState(true);

  const handleToggleAnswers = (isVisible: boolean) => {
    setShowAnswers(isVisible);
  };

  return (
    <div>
      <div className="flex flex-row justify-start items-center gap-4 mb-1">
        <HideAnswersButton
          count={count}
          onToggleAnswers={handleToggleAnswers}
        />
        {canReply && <ReplyQuestion question={question} />}
        <ShareButton
          question={question}
          username={username}
          answers={answers}
        />
      </div>
      {showAnswers &&
        answers.map((answer) => <AnswerCard key={answer.id} answer={answer} />)}
    </div>
  );
}
