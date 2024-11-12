'use client';

import { FormProvider, useForm } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import OAuthSignIn from './oauth-signin';
import type { Inputs } from '../signup/actions';
import { CreateUser } from '../signup/actions';
import { useRouter } from 'next/router';

export default function SignUpForm() {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      email: '',
      username: '',
      password: '',
    },
  });
  const handleSubmit = async (inputs: Inputs) => {
    const err: { error?: string | undefined, ok?: boolean } = await CreateUser(inputs);
    if (err?.error) {
      console.log(err.error);
    } 
    if (err?.ok) {
      router.push('/');
    }
  };

  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>email</FormLabel>
                <FormControl>
                  <Input {...field}></Input>
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
                <FormLabel>username</FormLabel>
                <FormControl>
                  <Input {...field}></Input>
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
                <FormLabel>password</FormLabel>
                <FormControl>
                  <Input {...field}></Input>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <button
            type="submit"
            className="p-4 bg-blue-500 text-white rounded-lg"
          >
            Register
          </button>
        </form>
      </FormProvider>
      <div className="flex flex-row">
        <OAuthSignIn />
      </div>
    </>
  );
}
