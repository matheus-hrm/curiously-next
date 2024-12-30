'use client';

import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { useState } from 'react';
import Modal from '@/components/ui/modal';
import { SVGIcons } from '@/components/Icons';
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';

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
};

export default function ShareButton({ question }: QuestionProps) {
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    const shareData = generateShareUrl(question);
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: 'Link copied!',
          description: 'Question link copied to clipboard',
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: 'Error sharing',
        description: 'Could not share the question',
        variant: 'destructive',
      });
    }
  };
  return (
    <>
      <Button
        variant={'ghost'}
        className="hover:bg-black/10"
        onClick={handleShare}
      >
        <Share2 className="w-4 h-4" />
      </Button>
      {sharing && (
        <Modal isOpen={sharing} onClose={() => setSharing(false)}>
          <div className="flex flex-col justify-center items-start space-y-4 mt-5 py-4 bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-4">
            <p>Compartilhar</p>
            <div className="flex flex-row items-center justify-center">
              <Link href="https://twitter.com/intent/tweet">
                <SVGIcons.X className="h-10 hover:bg-black/10 rounded-lg p-2" />
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

function generateShareUrl(question: { id: string; content: string }) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const questionPath = `${baseUrl}/questions/${question.id}`;

  return {
    url: questionPath,
    text: `${question.content.substring(0, 100)}${
      question.content.length > 100 ? '...' : ''
    }"`,
  };
}
