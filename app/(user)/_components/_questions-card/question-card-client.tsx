'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import QuestionCard from './question-card';

type Answer = {
  id: string;
  content: string;
  questionId: string;
  username: string;
  profilePicture: string;
};

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
  username: string; // Add username to props
};

export default function QuestionCardClient({
  question,
  ...props
}: QuestionCardProps) {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get('highlight');

  useEffect(() => {
    if (highlightId === question.id) {
      const questionElement = document.getElementById(
        `question-${question.id}`,
      );
      if (questionElement) {
        questionElement.scrollIntoView({ behavior: 'smooth' });
        questionElement.style.backgroundColor = '#f0f8ff'; // Highlight color
      }
    }
  }, [highlightId, question.id]);

  return <QuestionCard {...props} question={question} />;
}
