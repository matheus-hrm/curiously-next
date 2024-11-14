import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { Link2, User } from 'lucide-react';

type ProfileSidebarProps = {
  user: {
    name: string;
    avatar: string;
    bio: string;
    socials: string[];
  };
};

export function ProfileSidebar({ user }: ProfileSidebarProps) {
  return (
    <div className="relative">
      <Card className="sticky top-8 backdrop-blur-lg bg-white/80 border-none shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            {user.avatar && (
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback></AvatarFallback>
              </Avatar>
            )}
            <div className="h-32 w-32 mb-4 flex items-center justify-center rounded-full border-2 border-zinc-300">
              <User className="h-24 w-24 text-gray-500" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
            <p className="text-sm text-gray-500 mb-4">{user.bio}</p>
            <Button variant="outline" className="w-full">
              <Link2 className="mr-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
