'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Eye, EyeClosed, LoaderCircle, Send } from 'lucide-react';
import { useState } from 'react';
import { SendQuestion } from '../[username]/actions';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import {
  TooltipTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';

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
  const [isAnonymous, setIsAnonymous] = useState(false);

  const senderId = loggedUserId ? loggedUserId : null;

  const handleSendQuestion = async (content: string, isAnonymous: boolean) => {
    if (!content.trim()) {
      setError(true);
      setTimeout(() => setError(false), 2000);
      return;
    }

    try {
      setLoading(true);
      await SendQuestion(
        content,
        isAnonymous ? null : senderId,
        receiverId,
        isAnonymous,
      );
      setQuestion('');
      toast({
        title: 'Success',
        description: 'Question sent successfully',
      });
    } catch (error) {
      setError(true);
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to send question',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed bottom-8  md:left-1/3 lg:left-1/3 lg:focus-within:left-1/4 w-full max-w-md md:max-w-xl lg:max-w-3xl lg:focus-within:max-w-screen-lg px-4 transition-all duration-300 ease-in-out ${
        error ? 'animate-shake' : ''
      }`}
      style={{ position: 'fixed' }}
    >
      <Card className="backdrop-blur-lg bg-white/90 border-none shadow-lg">
        <CardContent className="p-4 flex flex-row items-center justify-center">
          <Input
            placeholder={
              error ? 'Mensagem não pode ser vazia' : 'Pergunte algo...'
            }
            className="w-full bg-transparent border-none shadow-none focus-visible:ring-0 text-lg"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Label
                  htmlFor="anon"
                  className="flex flex-row items-center justify-center  gap-2"
                >
                  <Switch
                    id="anon"
                    onCheckedChange={() => setIsAnonymous(!isAnonymous)}
                    className=""
                  />
                  <div className="mr-2">
                    {isAnonymous ? (
                      <EyeClosed className="w-4" />
                    ) : (
                      <Eye className="w-4" />
                    )}
                  </div>
                </Label>
              </TooltipTrigger>
              <TooltipContent>
                <p className="">Mandar como anônimo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {!loading ? (
            <Button
              onClick={() => handleSendQuestion(question, isAnonymous)}
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
