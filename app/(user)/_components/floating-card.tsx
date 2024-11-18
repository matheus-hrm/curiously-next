'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LoaderCircle, Send } from 'lucide-react';
import { useState } from 'react';
import { SendQuestion } from '../[username]/actions';

export default function FloatingCard({
  receiverId,
  loggedUserId,
}: {
  receiverId: string;
  loggedUserId: string | undefined | null;
}) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const senderId = loggedUserId ? loggedUserId : null;

  const handleSendQuestion = async (content: string, isAnonymous: boolean) => {
    if (content) {
      setLoading(true);
      setQuestion('');
      await SendQuestion(content, senderId!, receiverId, isAnonymous);
      setTimeout(() => {
        setLoading(false);
      }, 200);
    } else {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 2000);
    }
  };
  return (
    <div
      className={`fixed bottom-8 left-1/3 w-full max-w-2xl px-4 ${
        error ? 'animate-shake' : ''
      }`}
      style={{ position: 'fixed' }}
    >
      <Card className="backdrop-blur-lg bg-white/90 border-none shadow-lg">
        <CardContent className="p-4 flex flex-row items-center">
          <Input
            placeholder={error ? 'Message cannot be empty' : 'Ask something...'}
            className="w-full bg-transparent border-none shadow-none focus-visible:ring-0 text-lg"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          {!loading ? (
            <Button
              onClick={() =>
                handleSendQuestion(question, senderId ? false : true)
              }
              className={error ? 'bg-red-500 hover:bg-red-500' : 'bg-green-500'}
            >
              <Send className="w-2" />
            </Button>
          ) : (
            <Button className="bg-zinc-500">
              <LoaderCircle className="w-2 animate-spin" />
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
