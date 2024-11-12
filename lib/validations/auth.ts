import * as z from 'zod';

export const authSchema = z.object({
  username: z.string().min(3, {
    message: 'Username must be at least 3 characters long',
  }),
  password: z
    .string()
    .min(6, {
      message: 'Password must be at least 6 characters long',
    })
    .max(60, {
      message: 'Password must be less than 60 characters long',
    }),
  email: z.string().email({
    message: 'Invalid email',
  }),
});

export const checkEmailSchema = z.object({
  email: authSchema.shape.email,
});

export const resetPasswordSchema = z
  .object({
    password: authSchema.shape.password,
    confirmPassword: authSchema.shape.password,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const signUpSchema = z.object({
  email: authSchema.shape.email,
  username: authSchema.shape.username,
  password: authSchema.shape.password,
});
