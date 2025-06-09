import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('credentials', credentials)
        if (!credentials?.email || !credentials.password) {
          throw new Error('Missing credentials')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) throw new Error('User not found')

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!isValid) throw new Error('Invalid password')

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          hotelId: user.hotelId
        }
      }
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async session({ session, token }) {
      session.user.id = parseInt(token.sub || '0')
      session.user.role = token.role as string
      session.user.hotelId = token.hotelId as number
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.hotelId = (user as any).hotelId
      }
      return token
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
