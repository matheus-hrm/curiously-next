import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { LoaderCircle, LogIn } from 'lucide-react';

type SignInButtonProps = {
  onClick: () => void;
};

export default function SignInButton({ onClick }: SignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    onClick();
  };

  return (
    <Button
      type="submit"
      disabled={isLoading}
      onClick={handleClick}
      className="p-4 bg-black text-white rounded-lg flex items-center justify-center"
    >
      {isLoading ? (
        <>
          <p className="transition-all">Loading</p>
          <LoaderCircle className="w-6 h-6 animate-spin" />
        </>
      ) : (
        <p className=" transition-all">Sign In</p>
      )}
      {!isLoading && <LogIn className="w-6 h-6 ml-2" />}
    </Button>
  );
}
