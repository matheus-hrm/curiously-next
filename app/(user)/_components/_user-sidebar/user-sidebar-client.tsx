'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ProfileSidebar } from './profile-sidebar';
import EditProfileButton from './edit-profile-button';
import EditingSidebar from './editing-sidebar';

type UserSidebarClientProps = {
  user: {
    name: string;
    id: string;
    avatar: string;
    bio: string;
    socials: string[];
  };
  isLogged: boolean;
};

export default function UserSidebarClient({
  user,
  isLogged,
}: UserSidebarClientProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => setIsEditing(true);
  const handleClose = () => setIsEditing(false);

  return (
    <>
      {isEditing ? (
        <EditingSidebar user={user} onClose={handleClose} />
      ) : (
        <ProfileSidebar
          user={user}
          onEditProfile={handleEdit}
          isLogged={isLogged}
        />
      )}
    </>
  );
}
