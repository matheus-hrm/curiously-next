'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Modal from '@/components/ui/modal';
import { SVGIcons } from '@/components/Icons';
import { Share2 } from 'lucide-react';

type QuestionProps = {
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
  answers: Answer[] | undefined;
  username: string;
};

type Answer = {
  id: string;
  content: string;
  questionId: string;
  username: string;
  profilePicture: string;
};

export default function ShareButton({
  question,
  answers,
  username,
}: QuestionProps) {
  const [sharing, setSharing] = useState(false);

  let tweetText = '';
  answers?.forEach((answer) => {
    if (answer.questionId === question.id) {
      tweetText += `${answer.content}\n\n`;
    }
  });

  const handleTwitterShare = () => {
    const baseUrl = 'https://twitter.com/intent/tweet';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;

    const questionUrl = `${appUrl}/${username}?highlight=${question.id}`;

    window.open(
      `${baseUrl}?text=${encodeURIComponent(
        tweetText,
      )}&url=${encodeURIComponent(questionUrl)}`,
      '_blank',
      'noopener',
    );
  };

  return (
    <>
      <Button
        variant={'ghost'}
        onClick={() => setSharing(true)}
        className="hover:bg-black/10"
      >
        <Share2 className="w-4 h-4" />
      </Button>

      {sharing && (
        <Modal isOpen={sharing} onClose={() => setSharing(false)}>
          <div className="flex flex-col justify-center items-start  mt-5 bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-5">
            <p className="text-xl">Compartilhar</p>
            <div className="flex flex-row items-center justify-center space-x-5">
              <button onClick={handleTwitterShare} className="my-2 ">
                <SVGIcons.X className="w-8 h-8" />
              </button>
              <button
                // onClick={handleTwitterShare}
                className="my-2 "
              >
                <SVGIcons.discord className="w-8 h-8" />
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
