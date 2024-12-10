'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import SidebarSocialLinks from './sidebar-socials';
import EditProfileButton from './edit-profile-button';
import FollowButton from './follow-button';

type ProfileSidebarProps = {
  user: {
    name: string;
    username: string;
    id: string;
    avatar: string;
    bio: string;
    socials: string[];
    following: string[];
    followers: string[];
  };
  isLogged: boolean;
  loggedUserId: string | null | undefined;
  onEditProfile: () => void;
};

export function ProfileSidebar({
  user,
  isLogged,
  loggedUserId,
  onEditProfile,
}: ProfileSidebarProps) {
  return (
    <div className="relative">
      <Card className="sticky top-8 backdrop-blur-lg bg-white/80 border-none shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            {user.avatar ? (
              <Avatar className="h-32 w-32 mb-4 ">
                <AvatarImage
                  className="rounded-full border-2 border-zinc-400"
                  src={user.avatar}
                  alt={user.name}
                />
              </Avatar>
            ) : (
              <div className="h-32 w-32 mb-4 flex items-center justify-center rounded-full border-2 border-zinc-300">
                <User className="h-24 w-24 text-gray-500" aria-hidden="true" />
              </div>
            )}
            <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
            <div className="flex flex-row space-x-1 text-sm justify-center items-center mb-3">
              <p className="text-black">{user.following?.length || 0}</p>
              <p className="text-gray-500 pr-4">Seguindo</p>
              <p className="text-black">{user.followers?.length || 0}</p>
              <p className="text-gray-500 ">Seguidores </p>
            </div>

            <p className="text-sm text-black mb-2 resize-none disabled  p-5 ">
              {user.bio}
            </p>
            <SidebarSocialLinks props={{ socials: user.socials }} />
            {isLogged ? (
              <>
                <EditProfileButton onEditProfile={onEditProfile} />
              </>
            ) : (
              <>
                <FollowButton profileId={user.id} userId={loggedUserId} />
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
