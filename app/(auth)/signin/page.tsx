import { redirect } from 'next/navigation';
import SignInForm from '../_components/signin-form';
import { auth } from '@/lib/auth';
import { User } from '@/app/types/user';

export default async function SignInPage() {
  const session = await auth();
  const user = (await session?.user) as User;
  if (user) {
    redirect(`/${user.username}`);
  }
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <SignInForm />
      </div>
    </>
  );
}
