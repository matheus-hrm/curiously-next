'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import OAuthSignIn from './oauth-signin';

import { Inputs, signUpFormAction } from '../signup/actions';

import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function SignUpForm() {
  const formSchema = z.object({
    username: z
      .string()
      .min(3, { message: 'Username must be at least 3 characters long' })
      .max(20),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' })
      .max(100),
  });

  const form = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
    },
  });
  const handleSubmit = async (inputs: Inputs) => {
    await signUpFormAction(inputs);
  };

  return (
    <>
      <Card className="mt-12 max-w-md w-full flex flex-col items-center justify-center">
        <CardTitle className="text-2xl p-2 mt-4">Sign Up</CardTitle>
        <CardDescription className="text-sm mb-8">
          Choose your sign-up method
        </CardDescription>
        <CardContent>
          <OAuthSignIn />
          <div className="relative my-4">
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
              className="space-y-4 flex flex-col w-full justify-center"
            >
              <Card className="w[500px]">
                <CardContent>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <Label className="font-semibold">Email</Label>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <Label className="font-semibold">Username</Label>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="John123" {...field} />
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
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <button
                type="submit"
                className="p-4 bg-black text-white rounded-lg flex items-center justify-center"
              >
                Register
              </button>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
      <span className="text-sm text-muted-foreground mt-4">
        Already have an account?
        <span className="font-bold p-2 text-black">
          <Link href={'/signin'}>Sign In</Link>
        </span>
      </span>
    </>
  );
}
