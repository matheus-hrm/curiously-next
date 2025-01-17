import { auth } from '@/lib/auth';
import { User } from '@/app/types/user';
import { redirect } from 'next/navigation';
import { MainLogo } from '@/components/main-logo';
import SignInForm from '../_components/signin-form';

export default async function SignUpPage() {
  const session = await auth();
  const user = session?.user as User;
  if (user) {
    redirect(`/${user.username}`);
  }
  return (
    <>
      <div className="flex text-black flex-col justify-center items-center">
        <MainLogo />
        <SignInForm />
      </div>
    </>
  );
}
