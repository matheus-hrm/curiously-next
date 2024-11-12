import NextAuth, { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { prisma } from '@/prisma/prisma';
import { saltAndHashPassword, verifyPassword } from './jwt';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Discord from 'next-auth/providers/discord';

class InvalidLoginError extends CredentialsSignin {
  code = 'Invalid username or password';
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/signin',
    signOut: '/signout',
    error: '/error',
    verifyRequest: '/verify-request',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'username' },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'password',
        },
      },

      async authorize(credentials) {
        if (!credentials || !credentials.username || !credentials.password) {
          return null;
        }

        const dbUser = await prisma.user.findFirst({
          where: 
          {
            username: credentials.username,
          },
        });
        if (!dbUser) {
          console.log('no user');
          throw new InvalidLoginError();
        }

        const r = saltAndHashPassword(credentials.password as string);

        const isValid = verifyPassword(
          credentials.password as string,
          dbUser.hashedPassword,
          r.salt,
        );
        if (!isValid) {
          throw new InvalidLoginError();
        }

        const response = await fetch('/api/auth/signin', {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { 'Content-Type': 'application/json' },
        });
        const user = await response.json();
        if (response.ok && user) {
          return user;
        } else {
          throw new InvalidLoginError();
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider == 'google' || account?.provider == 'discord') {
        let userData = await prisma.user.findFirst({
          where: {
            OR: [
              {
                email: profile?.email,
                username: profile?.username,
              },
            ],
          },
        });
        if (!userData) {
          userData = await prisma.user.create({
            data: {
              email: profile?.email,
              username: profile?.username,
            },
          });
        }
      }
      return true;
    },
    async session({ session }) {
      const dbuser = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
      });
      session.user = dbuser;
      return session;
    },
  },
});
