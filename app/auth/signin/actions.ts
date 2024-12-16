'use client';

import { signIn } from '@/lib/auth';
import { authSchema } from '@/lib/validations/auth';
import { z } from 'zod';

export type Inputs = z.infer<typeof authSchema>;

export async function signInWithGoogle() {
  signIn('google');
}

export async function signInWithDiscord() {
  signIn('discord');
}

export async function signInForm(formData: Inputs) {
  const validationResult = authSchema.safeParse(formData);
  if (!validationResult.success) {
    return validationResult.error;
  }

  const { username, password } = validationResult.data;

  return signIn('credentials', {
    username,
    password,
  });
}
