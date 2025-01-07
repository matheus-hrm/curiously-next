import NextAuth, { CredentialsSignin, Account, Profile } from 'next-auth';
import Google from 'next-auth/providers/google';
import Discord from 'next-auth/providers/discord';
import { prisma } from '@/prisma/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';

class InvalidLoginError extends CredentialsSignin {
  code = 'Invalid username or password';
}

//TODO: Make function to send current profile picture to cloudinary so the cdn does not expires someday
//TODO: CHANGE FROM CREDENTIALS TO MAGIC LINK
// ADD FORGOT PASSWORD FLOW

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  adapter: PrismaAdapter(prisma),
  debug: true,
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
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
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.username = (user as any).username;
      }

      if (account && profile) {
        token.provider = account.provider;
        token.accessToken = account.accessToken;
      }

      return token;
    },
    async signIn({
      account,
      profile,
    }: {
      account?: Account | null;
      profile?: Profile;
    }) {
      if (!account?.provider || !profile?.email) {
        return false;
      }

      if (account.provider == 'google' || account.provider == 'discord') {
        try {
          const user = await prisma.user.findFirst({
            where: {
              email: profile.email,
            },
          });
          if (!user) {
            if (account.provider == 'discord') {
              await prisma.user.create({
                data: {
                  email: profile.email,
                  username: String(profile?.username),
                  name: String(profile?.global_name),
                  hashedPassword: '',
                  profilePicture: String(profile?.image_url),
                  accounts: {
                    create: {
                      type: account.type,
                      provider: account.provider,
                      providerAccountId: account.providerAccountId,
                      access_token: account.accessToken as string,
                      refresh_token: account.refreshToken as string,
                    },
                  },
                },
              });
            }
            if (account.provider == 'google') {
              await prisma.user.create({
                data: {
                  email: profile?.email,
                  username: String(profile?.name),
                  name: String(profile?.name),
                  hashedPassword: '',
                  profilePicture: String(profile?.picture),
                  accounts: {
                    create: {
                      type: account.type,
                      provider: account.provider,
                      providerAccountId: account.providerAccountId,
                      access_token: account.accessToken as string,
                      refresh_token: account.refreshToken as string,
                    },
                  },
                },
              });
            }
          }
          return true;
        } catch (error) {
          console.error(error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).username = token.username;
      }
      return session;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
});
