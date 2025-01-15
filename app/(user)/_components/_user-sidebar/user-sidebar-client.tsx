'use client';

import { useState } from 'react';
import { ProfileSidebar } from './profile-sidebar';
import EditingSidebar from './editing-sidebar';

type UserSidebarClientProps = {
  user: {
    name: string;
    username: string;
    id: string;
    avatar: string;
    bio: string;
    socials: string[];
    followers: {
      id: string;
      username: string;
      name: string;
      profilePicture: string | null;
    }[];
    following: {
      id: string;
      username: string;
      name: string;
      profilePicture: string | null;
    }[];
  };
  isLogged: boolean;
  loggedUserId: string | null | undefined;
};

export default function UserSidebarClient({
  user,
  isLogged,
  loggedUserId,
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
          loggedUserId={loggedUserId}
        />
      )}
    </>
  );
}
