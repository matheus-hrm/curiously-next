
import { auth } from "@/lib/auth";
import Link from "next/link";

async function Home() {
  const session = await auth() 
  if (!session) {
    return <div>loading...</div>
  }
  if (!session.user) {
    return null
  }
  return (
    <div className="flex flex-col justify-center items-center m-5 text-lg">
      <Link href="/signin">Sign In</Link>
      <Link href="/signup">Sign Up</Link>
      <Link href={`/${session.user.name}`}>{session.user.name} Profile</Link>
    </div>
  );
}

export default function HomePage() {
  return (
      <Home />
  );
}