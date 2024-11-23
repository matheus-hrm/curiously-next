import NextAuth, { CredentialsSignin, Account ,Profile} from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import Discord from 'next-auth/providers/discord';
import { prisma } from '@/prisma/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
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
    async jwt({ token, user, account, profile }) {
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
  async signIn({ account, profile }: { account?: Account | null; profile?: Profile }) {
    if (account?.provider == 'google' || account?.provider == 'discord') {
      try {
      const user = await prisma.user.findFirst({
        where: 
            {
              email: profile?.email ?? undefined,
            },
          });
      if (!user) {
        if (account?.provider == 'discord') {
          await prisma.user.create({
            data: {
              email: profile?.email!,
              username: String(profile?.username),
              name: String(profile?.global_name),
              hashedPassword: '',
              profilePicture: String(profile?.image_url!),
              accounts: {
                create: {
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.accessToken as string | undefined,
                  refresh_token: account.refreshToken as string | undefined,
                },
              }
            },
          });
        }
        if (account?.provider == 'google') {
          console.log(profile);
          await prisma.user.create({
            data: {
              email: profile?.email!,
              username: String(profile?.name),
              name: String(profile?.name),
              hashedPassword: '',
              profilePicture: String(profile?.picture),
              accounts: {
                create: {
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.accessToken as string | undefined,
                  refresh_token: account.refreshToken as string | undefined,
                },
              }
            }
          })
        }
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
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
  async redirect({ url, baseUrl }: { url: string; baseUrl: string;  }) {
    return url.startsWith(baseUrl) ? url : baseUrl; 
  },
  },
});
