import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import Link from 'next/link';
import { getUserById } from './(user)/[username]/actions';

async function Home() {
  const user = await getUserPage();
  return (
    <div className="flex justify-center items-center">
      <Card className="p-4 flex justify-center  m-5 text-lg">
        <CardContent className="flex flex-col space-y-5">
          <Button>
            <Link href="/signin">Sign In</Link>
          </Button>
          <Button>
            <Link href="/signup">Sign Up</Link>
          </Button>
          <Button>
            {user ? (
              <Link href={`/${(user as any).username}`}>
                {user.name} Profile
              </Link>
            ) : (
              <div>Not signed in</div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function HomePage() {
  return <Home />;
}

const getUserPage = async () => {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;
  const user = getUserById(id);
  return user;
};
