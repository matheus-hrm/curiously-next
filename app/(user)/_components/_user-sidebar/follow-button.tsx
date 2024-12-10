'use client';

import { followUser } from '@/app/api/[username]/follow/route';
import { unfollowUser } from '@/app/api/[username]/unfollow/route';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

type FollowButtonProps = {
  profileId: string;
  userId: string | null | undefined;
};

export default function FollowButton({ profileId, userId }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  useEffect(() => {
    if (!userId) return;
    const checkIsFollowing = async () => {
      try {
        const response = await fetch(
          `/api/is-following?userId=${userId}&profileId=${profileId}`,
        );
        const data = await response.json();
        console.log('isFollowing', data.isFollowing);
        setIsFollowing(data.isFollowing);
      } catch (error) {
        console.error(error);
      }
    };
    checkIsFollowing();
  }, [userId, profileId]);

  const handleFollow = () => {
    if (userId === null || userId === undefined) {
      toast({
        title: 'Você precisa estar logado para seguir alguém',
        variant: 'destructive',
      });
      return;
    }
    if (isFollowing) {
      setIsFollowing(false);
      unfollowUser(profileId, userId);
    } else {
      setIsFollowing(true);
      followUser(profileId, userId);
    }
  };

  return (
    <>
      {isFollowing ? (
        <Button
          variant="outline"
          className="w-full hover:bg-black/20 "
          onClick={handleFollow}
        >
          <p>Deixar de seguir</p>
        </Button>
      ) : (
        <Button
          variant="outline"
          className="w-full hover:bg-black/80 bg-black text-white hover:text-white"
          onClick={handleFollow}
        >
          <p>Seguir</p>
        </Button>
      )}
    </>
  );
}

function isFollowingUser(following: any[], profileId: string) {
  return following.some((user) => user.id === profileId);
}
