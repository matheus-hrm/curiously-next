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

type FloatingCardProps = {
  receiverId: string;
  loggedUserId: string | undefined | null;
};

export default function FloatingCard({
  receiverId,
  loggedUserId,
}: FloatingCardProps) {
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
        title: 'Sucesso',
        description: 'Sua pergunta foi enviada',
      });
    } catch (error) {
      setError(true);
      toast({
        title: 'Erro',
        description:
          error instanceof Error ? error.message : 'Erro ao enviar pergunta',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed bottom-2  sm:bottom-8 md:left-1/3 lg:left-1/3 md:w-full max-w-sm md:max-w-xl lg:max-w-4xl md:px-8 transition-all duration-300 ease-in-out ${
        error ? 'animate-shake' : ''
      }`}
      style={{ position: 'fixed' }}
    >
      <Card className="backdrop-blur-lg bg-white border-none shadow-lg  ">
        <CardContent className="p-2  sm:p-4 w-full flex flex-row items-center justify-center rounded-lg sm:rounded-none border-stone-400 border-2 sm:border-none">
          <Input
            placeholder={
              error ? 'Mensagem não pode ser vazia' : 'Pergunte algo...'
            }
            className="pr-8 sm:pr-0 sm:mr-4 sm:w-full bg-transparent border-none shadow-none focus-visible:ring-0 text-sm md:text-lg"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Label
                  htmlFor="anon"
                  className="flex flex-row items-center justify-center gap-1 md:gap-2"
                >
                  <Switch
                    id="anon"
                    onCheckedChange={() => setIsAnonymous(!isAnonymous)}
                    className=""
                  />
                  <div className="mr-1 md:mr-2">
                    {isAnonymous ? (
                      <EyeClosed className="w-2 sm:w-4" />
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
              className={
                error
                  ? 'bg-red-500 hover:bg-red-500'
                  : 'bg-[hsl(var(--main-green))] hover:bg-[hsl(var(--main-green-dark))]'
              }
            >
              <Send className="w-2" />
            </Button>
          ) : (
            <Button className="bg-[hsl(var(--main-blue))]">
              <LoaderCircle className="w-2 animate-spin" />
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
