import { Avatar, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

type ProfileTooltipProps = {
  user: {
    name: string;
    username: string;
    profilePicture: string;
  };
};

export default function ProfileTooltip({ user }: ProfileTooltipProps) {
  return (
    <>
      <div className="flex flex-col ml-2">
        <Link href={`/${user.username}`}>
          <Avatar className="h-10 w-10 m-2">
            <AvatarImage src={user.profilePicture} className="w-full" />
          </Avatar>
        </Link>
      </div>
    </>
  );
}
