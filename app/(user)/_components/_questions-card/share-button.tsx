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
  answer: string;
  username: string;
};

export default function ShareButton({
  question,
  answer,
  username,
}: QuestionProps) {
  const [sharing, setSharing] = useState(false);

  function handleTwitterShare() {
    const baseUrl = 'https://twitter.com/intent/tweet';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;

    // Generate the permalink to the question
    const questionUrl = `${appUrl}/${username}?highlight=${question.id}`;

    // Create tweet text with answer
    const tweetText = `${answer}\n\n`;

    window.open(
      `${baseUrl}?text=${encodeURIComponent(
        tweetText,
      )}&url=${encodeURIComponent(questionUrl)}`,
      '_blank',
      'noopener',
    );
  }

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
          <div className="flex flex-col justify-center items-start space-y-4 mt-5 py-4 bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-4">
            <p>Compartilhar</p>
            <div className="flex flex-row items-center justify-center">
              <Button
                variant={'ghost'}
                className="hover:bg-black/10"
                onClick={handleTwitterShare}
              >
                <SVGIcons.X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
