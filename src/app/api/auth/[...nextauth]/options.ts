import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/config/db'; // Importing Prisma from your config

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Email or Username', type: 'text', placeholder: 'user@example.com or username' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(
        credentials: Record<"identifier" | "password", string> | undefined
      ): Promise<{ id: string; email: string; username: string; isVerified: boolean } | null> {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error('Email/Username and password are required');
        }

        try {
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: credentials.identifier },
                { username: credentials.identifier }
              ]
            },
          });

          if (!user) {
            throw new Error('No user found with this identifier');
          }

          if (!user.isVerified) {
            throw new Error('Please verify your account before logging in');
          }

          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordCorrect) {
            throw new Error('Incorrect password');
          }

          return {
            id: user.id,
            email: user.email,
            username: user.username,
            isVerified: user.isVerified,
          };
        } catch (error: unknown) {
          console.error('Authorization Error:', error);
          throw new Error('An error occurred while logging in');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isVerified = user.isVerified;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.isVerified = token.isVerified;
        session.user.username = token.username;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/sign-in',
  },
};
