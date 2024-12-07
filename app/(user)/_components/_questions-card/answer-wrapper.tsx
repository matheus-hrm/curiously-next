'use client';

import { useState } from 'react';
import HideAnswersButton from './hide-answers-button';
import AnswerCard from './answer-card';
import ReplyQuestion from './reply-question';

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
  question: any;
  canReply: boolean;
};

export default function AnswersWrapper({
  answers,
  count,
  question,
  canReply,
}: AnswersSectionProps) {
  const [showAnswers, setShowAnswers] = useState(true);

  const handleToggleAnswers = (isVisible: boolean) => {
    setShowAnswers(isVisible);
  };

  return (
    <div>
      <div className="flex flex-row justify-center items-center gap-4 mb-1">
        <HideAnswersButton
          count={count}
          onToggleAnswers={handleToggleAnswers}
        />
        {canReply && <ReplyQuestion question={question} />}
      </div>
      {showAnswers &&
        answers.map((answer) => <AnswerCard key={answer.id} answer={answer} />)}
    </div>
  );
}
