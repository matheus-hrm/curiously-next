'use server'

import * as z from 'zod';
import { authSchema } from '@/lib/validations/auth';
import { prisma } from '@/prisma/prisma';
import { hashPassword } from '@/lib/jwt';

export type Inputs = z.infer<typeof authSchema>;

export async function CreateUser(FormData: Inputs) {
  const validationResults = authSchema.safeParse(FormData);
  if (!validationResults.success) {
    return validationResults.error;
  }

  const { email, username, password } = validationResults.data;
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: email },
        { username: username},
      ],
    },
  });
  if (user) {
    return { error: 'User already exists' };
  }

  const passwordHash = await hashPassword(password);
  
  const newUser = await prisma.user.create({
    data: {
      id: undefined,
      email,
      name: username,
      username,
      hashedPassword: passwordHash,
    },
  });

  if (!newUser) {
    return { error: 'Failed to create user' };
  }
  return { ok: true };
}

export async function signUpFormAction(data: Inputs) {
  return await CreateUser(data);
}