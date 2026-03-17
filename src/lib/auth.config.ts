import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'

const ALLOWED_DOMAINS = ['oky.asahi.ac.jp', 'asahi.ac.jp']

function isAllowedEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const domain = email.split('@')[1]?.toLowerCase()
  return ALLOWED_DOMAINS.includes(domain)
}

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    signIn({ user, account }) {
      if (account?.provider === 'google') {
        return isAllowedEmail(user.email)
      }
      return true
    },
    authorized({ request }) {
      // Database sessions can't be verified at the Edge.
      // Route protection is handled server-side by requireAuth().
      // Middleware only handles signIn domain restriction + CSRF.
      const isPublic =
        request.nextUrl.pathname === '/login' ||
        request.nextUrl.pathname === '/~offline'
      return true
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
}
