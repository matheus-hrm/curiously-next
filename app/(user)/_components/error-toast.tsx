'use client';

import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';

export default function ErrorToast() {
  const toast = useToast();
  const searchParams = useSearchParams();

  const error = searchParams.get('error');
  if (error) {
    toast.toast({
      title: 'Error',
      content: error,
      type: 'foreground',
    });
  }
  return <Toaster />;
}
