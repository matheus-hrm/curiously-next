'use client';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

type HideAnswersProps = {
  count: number;
  onToggleAnswers: (showAnswers: boolean) => void;
};

export default function HideAnswersButton({
  count,
  onToggleAnswers,
}: HideAnswersProps) {
  const [showAnswers, setShowAnswers] = useState(true);

  const handleToggle = () => {
    setShowAnswers(!showAnswers);
    onToggleAnswers(!showAnswers);
  };

  return (
    <div className="flex flex-row items-center justify-center gap-4 ">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        className="hover:bg-black/10"
      >
        <>
          <ChevronDown
            className={`mr-1 h-4 w-4 ${
              showAnswers
                ? 'transition-all rotate-0 duration-200 ease-in-out'
                : '-rotate-90 transition-all duration-200 ease-in-out'
            }`}
          />
        </>

        <p className="font-thin text-md">{count}</p>
      </Button>
    </div>
  );
}
