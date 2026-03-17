import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './db'

const ALLOWED_DOMAINS = ['oky.asahi.ac.jp', 'asahi.ac.jp']

function isAllowedEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const domain = email.split('@')[1]?.toLowerCase()
  return ALLOWED_DOMAINS.includes(domain)
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === 'google') {
          // Use profile email (from Google directly) as primary, user.email as fallback
          const email = (profile as { email?: string })?.email ?? user.email
          console.log(`[auth] signIn: email=${email}, user.email=${user.email}, profile.email=${(profile as { email?: string })?.email}`)
          if (!isAllowedEmail(email)) {
            return '/login?error=AccessDenied'
          }
        }
        return true
      } catch (err) {
        console.error('[auth] signIn callback error:', err)
        return '/login?error=SignInError'
      }
    },
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})
