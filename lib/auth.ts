import NextAuth, { CredentialsSignin, Account } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import Discord from 'next-auth/providers/discord';
import { prisma } from '@/prisma/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { JWT } from 'next-auth/jwt';
import { User } from 'next-auth';
import { verifyPassword } from './jwt';

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
        password: { label: 'Password', type: 'password', placeholder: 'password', },
      },

      async authorize(credentials) {
        if (!credentials || !credentials.username || !credentials.password) {
          throw new InvalidLoginError();
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

        const isValid = await verifyPassword(credentials.password as string, dbUser.hashedPassword);
        if (!isValid) {
          throw new InvalidLoginError();
        }

        return {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.username,
          username: dbUser.username,
        };
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }: { token: JWT, user?: User, account?: Account | null, profile?: any }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
      }

      if (account && profile) {
        token.provider = account.provider;
        token.accessToken = account.accessToken;
      }

      return token;
    },
  async signIn({ account, profile }: { account: Account | null; profile?: any }) {
    if (account?.provider == 'google' || account?.provider == 'discord') {
      let userData = await prisma.user.findFirst({
        where: {
          OR: [
            {
              email: profile?.email ?? undefined,
              username: profile?.username as string,
            },
          ],
        },
      });
      if (!userData) {
        userData = await prisma.user.create({
          data: {
            email: profile?.email,
            username: profile?.username,
            name: profile?.name ?? profile?.username,
            hashedPassword: '',
          },
        });
      }
    }
    return true;
  },
  async session({ session, token }: { session: any; token: any }) {
    if (session.user) {
      session.user.id = token.id;
      session.user.username = token.username;
    } 
    return session;
  },
  },
});
