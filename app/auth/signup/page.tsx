import { auth } from '@/lib/auth';
import SignUpForm from '../_components/signup-form';
import { User } from '@/app/types/user';
import { redirect } from 'next/navigation';
import { MainLogo } from '@/components/main-logo';

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
        <SignUpForm />
      </div>
    </>
  );
}
