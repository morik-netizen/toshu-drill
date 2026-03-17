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
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user
      const isLoginPage = request.nextUrl.pathname === '/login'
      if (isLoginPage) return true
      return isLoggedIn
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
}
