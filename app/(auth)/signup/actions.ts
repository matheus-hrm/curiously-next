import * as z from 'zod';
import { authSchema } from '@/lib/validations/auth';
import { prisma } from '@/prisma/prisma';
import { saltAndHashPassword } from '@/lib/jwt';

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
        {
          email: email,
        },
        {
          username: username,
        },
      ],
    },
  });
  if (user) {
    return { error: 'User already exists' };
  }

  const p = await saltAndHashPassword(password);
  
  prisma.user.create({
    data: {
      email: email,
      name: username,
      username: username,
      hashedPassword: p.hash as string,
    },
  });

  return { ok: true };
}
