'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import SignInButton from './signin-button';
import OAuthSignIn from './oauth-signin';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Inputs, signInForm } from '../signin/actions';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';

export default function SignInForm() {
  const formSchema = z.object({
    username: z
      .string()
      .min(3, {
        message: 'Username must be at least 3 characters long',
      })
      .max(20),
    password: z
      .string()
      .min(6, {
        message: 'Password must be at least 6 characters long',
      })
      .max(100),
  });

  const form = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const handleSubmit = async (inputs: Inputs) => {
    const user = await signIn('credentials', {
      redirect: true,
      username: inputs.username,
      password: inputs.password,
      callbackUrl: `/${inputs.username}`,
    });

    if (!user?.ok) {
    }

    if (user?.ok) {
      signInForm(inputs);
    }
  };

  return (
    <>
      <Card className="mt-12 max-w-md w-full flex flex-col items-center justify-center">
        <CardTitle className="text-2xl p-2 mt-4">Login</CardTitle>
        <CardDescription className="text-sm mb-8">
          Choose your sign-in method
        </CardDescription>
        <CardContent>
          <OAuthSignIn />
          <div className="relative mt-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4 flex flex-col  w-full justify-center"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Label className="font-semibold">Username</Label>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="John123" {...field}></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Label className="font-semibold">Password</Label>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="*******"
                        {...field}
                      ></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SignInButton onClick={form.handleSubmit(handleSubmit)} />
            </form>
          </FormProvider>
        </CardContent>
      </Card>

      <span className="text-sm text-muted-foreground mt-4">
        Don&apos;t have an account ?
        <span className="font-bold p-2 text-black">
          <Link href={'/signup'}>Sign Up</Link>
        </span>
      </span>
    </>
  );
}
