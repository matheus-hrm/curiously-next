import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { User, UserPen } from 'lucide-react';
import SidebarSocialLinks from './sidebar-socials';

type ProfileSidebarProps = {
  user: {
    name: string;
    avatar: string;
    bio: string;
    socials: string[];
  };
};

export async function ProfileSidebar({ user }: ProfileSidebarProps) {
  const session = await auth();
  const isLogged = session?.user?.email;

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
            <Card className="flex flex-col w-full my-2">
              <CardTitle className="text-sm font-semibold p-2 items-start"></CardTitle>
              <CardContent className="flex items-center justify-center space-x-2">
                <p className="text-sm text-gray-500 mb-4">{user.bio}</p>
              </CardContent>
            </Card>
            <SidebarSocialLinks
              props={Promise.resolve({ user: { socials: user.socials } })}
            />
            {isLogged && (
              <Button variant="outline" className="w-full">
                <p>Edit profile</p>
                <UserPen className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
