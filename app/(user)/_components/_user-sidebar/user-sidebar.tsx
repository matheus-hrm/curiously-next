import UserSidebarClient from './user-sidebar-client';

type UserSidebarProps = {
  user: {
    name: string;
    id: string;
    avatar: string;
    bio: string;
    socials: string[];
  };
  isLogged: boolean;
};

export default function UserSidebar({ user, isLogged }: UserSidebarProps) {
  return <UserSidebarClient user={user} isLogged={isLogged} />;
}
