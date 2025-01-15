'use client';

import { useCallback, useEffect, useState } from 'react';
import QuestionCardClient from './question-card-client';
import { toast } from '@/hooks/use-toast';

type QuestionFeedClientProps = {
  initialQuestions: Question[];
  initialAnswers: Answer[];
  user: {
    username: string;
    avatar: string;
  };
  owner: boolean;
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

export default function QuestionFeedClient({
  initialQuestions,
  initialAnswers,
  user,
  owner,
}: QuestionFeedClientProps) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [answers] = useState(initialAnswers);

  const fetchQuestions = useCallback(async (username: string) => {
    const response = await fetch(`/api/questions?username=${username}`);
    const data = await response.json();
    return data.questions;
  }, []);

  const showToastNotification = useCallback(
    (newLength: number) => {
      if (newLength > questions.length && owner) {
        toast({
          title: 'Notificacao',
          description: 'Voce tem novas perguntas!',
          variant: 'default',
        });
      }
    },
    [questions.length, owner],
  );

  useEffect(() => {
    const interval = setInterval(async () => {
      const newQuestions = await fetchQuestions(user.username);
      showToastNotification(newQuestions.length);
      setQuestions(newQuestions);
    }, 10000);

    return () => clearInterval(interval);
  }, [user.username, fetchQuestions, showToastNotification]);

  return (
    <>
      {questions.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <p className="text-black/40 sm:text-md lg:text-4xl text-center">
            Nenhuma pergunta ainda :(
          </p>
        </div>
      )}
      {questions.map((question) => {
        const questionAnswers = answers.filter(
          (answer) => answer.questionId === question.id,
        );
        return (
          <div key={question.id} className="mb-6 last:mb-0">
            <QuestionCardClient
              question={question}
              answerCount={questionAnswers.length}
              owner={owner}
              answers={questionAnswers}
              username={user.username}
            />
          </div>
        );
      })}
    </>
  );
}
