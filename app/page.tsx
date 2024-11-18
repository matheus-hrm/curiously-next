import { auth } from '@/lib/auth';
import Link from 'next/link';

async function Home() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="flex flex-col justify-center items-center m-5 text-lg">
      <Link href="/signin">Sign In</Link>
      <Link href="/signup">Sign Up</Link>
      {user ? (
        <Link href={`/${(user as any).username}`}>{user.name} Profile</Link>
      ) : (
        <div>Not signed in</div>
      )}
    </div>
  );
}

export default function HomePage() {
  return <Home />;
}
