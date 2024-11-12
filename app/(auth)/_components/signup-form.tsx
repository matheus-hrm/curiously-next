import { useState } from 'react';
import { signIn } from 'next-auth/react';

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
import { SignUpFormAction } from '../signup/actions';

export default function SignUpForm() {
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: '',
      username: '',
      password: '',
    },
  });
  const handleSubmit = async (inputs: Inputs) => {
    const user = await signIn('credentials', {
      redirect: true,
      username: inputs.username,
      email: inputs.email,
      password: inputs.password,
    });

    if (!user?.ok) {
      setError(error);
    }

    if (user?.ok) {
      SignUpFormAction(inputs);
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
          <button type="submit">Register</button>
        </form>
      </FormProvider>
      <div className="flex flex-row">
        <OAuthSignIn />
      </div>
    </>
  );
}
