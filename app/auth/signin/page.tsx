import { redirect } from 'next/navigation';
import SignInForm from '../_components/signin-form';
import { auth } from '@/lib/auth';
import { User } from '@/app/types/user';
import { MainLogo } from '@/components/main-logo';

export default async function SignInPage() {
  const session = await auth();
  const user = session?.user as User;
  if (user) {
    redirect(`/${user.username}`);
  }
  return (
    <>
      <div className="h-screen flex flex-col justify-center items-center">
        <MainLogo />
        <SignInForm />
      </div>
    </>
  );
}
