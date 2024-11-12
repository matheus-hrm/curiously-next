import * as z from 'zod';
import { authSchema } from '@/lib/validations/auth';
import { prisma } from '@/prisma/prisma';

export type Inputs = z.infer<typeof authSchema>;

export async function SignUpFormAction(FormData: Inputs) {
  const validationResults = authSchema.safeParse(FormData);
  if (!validationResults.success) {
    return validationResults.error;
  }

  const { email, username, password } = validationResults.data;
  const user = await prisma.user.findUnique({
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
  prisma.user.create({
    data: {
      email: email,
      username: username,
      password: password,
    },
  });
}
