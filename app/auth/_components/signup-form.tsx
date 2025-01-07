'use client';

import OAuthSignIn from './oauth-signin';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';

import Link from 'next/link';

export default function SignUpForm() {
  return (
    <>
      <Card className="mt-12 max-w-md w-full flex flex-col items-center justify-center">
        <CardTitle className="text-2xl p-2 mt-4">Register</CardTitle>
        <CardDescription className="text-sm mb-4">
          Choose your sign-up method
        </CardDescription>
        <CardContent>
          <div className="relative my-4 mt-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
          </div>
          <OAuthSignIn />
        </CardContent>
      </Card>
      <span className="text-sm text-muted-foreground mt-4">
        Already have an account?
        <span className="font-bold p-2 text-black">
          <Link href={'/auth/signin'}>Sign In</Link>
        </span>
      </span>
    </>
  );
}
