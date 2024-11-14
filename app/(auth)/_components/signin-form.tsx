'use client';

import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

import OAuthSignIn from './oauth-signin';
import { Inputs, signInForm } from '../signin/actions';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export default function SignInForm() {
    const [error, setError] = useState<string | null>(null);

    const form = useForm<Inputs>({
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
        });

        if (!user?.ok) {
            setError(error);
        }

        if (user?.ok) {
            signInForm(inputs);
        }
    };

    return (
        <>
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
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
                                    <Input type="password" {...field}></Input>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <button
                        type="submit"
                        className="p-4 bg-blue-500 text-white rounded-lg"
                    >
                        Sign In
                    </button>
                </form>
            </FormProvider>
            <div className="flex flex-row">
                <OAuthSignIn />
            </div>
            <div>
                <p>Don't have an account ?</p>
                <Link href={'/signup'}>Sign Up</Link>
            </div>
        </>
    );
}
