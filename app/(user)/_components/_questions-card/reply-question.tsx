'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MessageCircle, SeparatorHorizontal } from 'lucide-react';
import { useState } from 'react';
import { replyQuestion } from '../../[username]/actions';
import { Input } from '@/components/ui/input';

type QuestionProp = {
  question: {
    id: string;
    createdAt: Date;
    content: string;
    isAnonymous: boolean;
    authorId?: string | null;
    receiverId?: string;
    sender?: {
      name: string;
      profilePicture: string;
    };
  };
};

export default function ReplyQuestion({ question }: QuestionProp) {
  const [reply, setReply] = useState('');
  const [replying, setReplying] = useState(false);

  const handleAnswerQuestion = async (question: QuestionProp['question']) => {
    if (!reply) return;
    if (question.receiverId === undefined) return;
    await replyQuestion(
      { id: question.id, receiverId: question.receiverId },
      reply,
    );
    setReply('');
    setReplying(false);
  };
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="bg-black text-white border-white border-2 hover:bg-black/70 hover:text-white"
            variant="outline"
            onClick={() => setReplying(!replying)}
          >
            <MessageCircle className="mr-1 h-4 w-4" />
            Reply
          </Button>
        </DialogTrigger>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Reply</DialogTitle>
            <div className="flex flex-col justify-center items-start mt-5 py-4 ">
              <div className="flex flex-row items-center ">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={question.sender?.profilePicture} />
                </Avatar>
                <p className="text-lg px-4">{question.sender?.name}</p>
              </div>
              <p className="text-xl mt-4 p-4 text-black border-t-2 border-gray-300 w-full">
                {question.content}
              </p>
            </div>
          </DialogHeader>
          <Input
            className="w-full"
            placeholder="Your reply"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <Button
            variant="default"
            onClick={() => handleAnswerQuestion(question)}
          >
            Send
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
