'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { useState } from 'react';
import { SendQuestion } from '../[name]/actions';

export default function FloatingCard(user: { id: string }) {
  const [question, setQuestion] = useState('');
  const id = user.id; 
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4">
      <Card className="backdrop-blur-lg bg-white/90 border-none shadow-lg">
        <CardContent className="p-4 flex flex-row items-center">
          <Input
            placeholder="Ask something..."
            className="w-full bg-transparent border-none shadow-none focus-visible:ring-0 text-lg"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          {id && 
            <Button onClick={() => sendQuestion(question, id)} className="bg-green-400">
              <Send  className='w-2'/>
            </Button>
          }
        </CardContent>
      </Card>
    </div>
  );
}

async function sendQuestion(content: string, userId: string) {
  await SendQuestion(content, userId);
}
