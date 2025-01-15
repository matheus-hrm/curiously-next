'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import { MessageCircle, Send, User } from 'lucide-react';
import { useState } from 'react';
import { replyQuestion } from '../../[username]/actions';
import { Input } from '@/components/ui/input';
import Modal from '@/components/ui/modal';

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
      <Button
        className="text-black hover:text-[hsl(var(--main-green-dark))]"
        variant="ghost"
        onClick={() => setReplying(!replying)}
      >
        <MessageCircle className="mr-1 h-4 w-4" />
      </Button>
      {replying && (
        <Modal isOpen={replying} onClose={() => setReplying(false)}>
          <div className="flex flex-col justify-center items-start mt-5 py-4 bg-opacity-10 backdrop-blur-xl rounded-lg p-4">
            <div className="flex flex-row items-center justify-center">
              <Avatar className="w-10 h-10">
                {question.sender?.profilePicture ? (
                  <AvatarImage src={question.sender?.profilePicture} />
                ) : (
                  <User className="h-10 w-10 text-black/60" />
                )}
              </Avatar>
              {question.sender?.name ? (
                <p className="text-lg px-4">{question.sender?.name}</p>
              ) : (
                <p className="text-md px-4">Anônimo</p>
              )}
            </div>
            <p className="text-xl mt-4 text-black w-full">{question.content}</p>
          </div>
          <Input
            className="w-full mt-4"
            placeholder="Sua resposta"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <Button
            variant="default"
            className="mt-4 bg-[hsl(var(--main-green))] hover:bg-[hsl(var(--main-green-dark))]"
            onClick={() => handleAnswerQuestion(question)}
          >
            Enviar
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </Modal>
      )}
    </>
  );
}
