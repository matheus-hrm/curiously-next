import { auth } from '@/lib/auth';
import UserSidebarClient from './user-sidebar-client';

type UserSidebarProps = {
  user: {
    name: string;
    username: string;
    id: string;
    avatar: string;
    bio: string;
    socials: string[];
    followers: string[];
    following: string[];
  };
  isLogged: boolean;
};

export default async function UserSidebar({
  user,
  isLogged,
}: UserSidebarProps) {
  let loggedUserId = null;
  if (isLogged) {
    loggedUserId = await getLoggedUserId(isLogged);
  }
  return (
    <UserSidebarClient
      user={user}
      isLogged={isLogged}
      loggedUserId={loggedUserId}
    />
  );
}

async function getLoggedUserId(isLogged: boolean) {
  if (!isLogged) {
    return null;
  }
  const session = await auth();
  return session?.user?.id;
}
