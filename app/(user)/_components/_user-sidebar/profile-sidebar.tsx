'use client';

import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import SidebarSocialLinks from './sidebar-socials';
import EditProfileButton from './edit-profile-button';

type ProfileSidebarProps = {
  user: {
    name: string;
    id: string;
    avatar: string;
    bio: string;
    socials: string[];
  };
  isLogged: boolean;
  onEditProfile: () => void;
};

export function ProfileSidebar({
  user,
  isLogged,
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
            <p className="text-sm text-gray-500 mb-4 resize-none disabled border-2 rounded-lg border-gray-200 w-full p-5 ">
              {user.bio}
            </p>
            <SidebarSocialLinks props={{ socials: user.socials }} />
            {isLogged && <EditProfileButton onEditProfile={onEditProfile} />}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
