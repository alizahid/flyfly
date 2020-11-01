import { User } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { InitOptions } from 'next-auth'
import Adapters from 'next-auth/adapters'
import Providers from 'next-auth/providers'

import { prisma } from '@flyfly/lib'

const options: InitOptions = {
  adapter: Adapters.Prisma.Adapter({
    prisma
  }),
  callbacks: {
    async redirect(url, baseUrl) {
      return `${baseUrl}/projects`
    },
    async session(session, user: User) {
      session.user = user

      return session
    }
  },
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: 'user:email'
    })
  ]
}

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> =>
  NextAuth(req, res, options)
