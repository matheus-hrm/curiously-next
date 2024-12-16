'use client';

import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

type FollowButtonProps = {
  profileId: string;
  userId: string | null | undefined;
  username: string;
};

export default function FollowButton({
  profileId,
  userId,
  username,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!userId) return;
    const checkIsFollowing = async () => {
      try {
        const response = await fetch(
          `/api/is-following?userId=${userId}&profileId=${profileId}`,
        );
        const data = await response.json();
        setIsFollowing(data.isFollowing);
      } catch (error) {
        console.error(error);
      }
    };
    checkIsFollowing();
  }, [userId, profileId]);

  const handleFollow = async () => {
    if (!userId) {
      toast({
        title: 'Você precisa estar logado para seguir alguém',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = isFollowing ? 'unfollow' : 'follow';
      const response = await fetch(`/api/${username}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, profileId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update follow status');
      }

      setIsFollowing(!isFollowing);
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
      // Revert state on error
      setIsFollowing(isFollowing);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isFollowing ? 'outline' : 'outline'}
      className={`w-full ${
        isFollowing
          ? 'hover:bg-black/20'
          : 'hover:bg-black/80 bg-black text-white hover:text-white'
      }`}
      onClick={handleFollow}
      disabled={isLoading}
    >
      <p>{isFollowing ? 'Deixar de seguir' : 'Seguir'}</p>
    </Button>
  );
}
