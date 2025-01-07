'use client';

import Link from 'next/link';
import OAuthSignIn from './oauth-signin';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';

export default function SignInForm() {
  return (
    <>
      <Card className="mt-12 max-w-md w-full flex flex-col items-center justify-center">
        <CardTitle className="text-2xl p-2 mt-4">Login</CardTitle>
        <CardDescription className="text-sm mb-4">
          Choose your sign-in method
        </CardDescription>
        <CardContent>
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase"></div>
          </div>
          <OAuthSignIn />
        </CardContent>
      </Card>

      <span className="text-sm text-muted-foreground mt-4">
        Don&apos;t have an account ?
        <span className="font-bold p-2 text-black">
          <Link href={'/auth/signup'}>Sign Up</Link>
        </span>
      </span>
    </>
  );
}
