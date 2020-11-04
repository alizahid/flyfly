import { PrismaClient, User } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { InitOptions } from 'next-auth'
import Adapters from 'next-auth/adapters'
import Providers from 'next-auth/providers'
import Stripe from 'stripe'

const prisma = new PrismaClient()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27'
})

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
  events: {
    async signIn({ isNewUser, user }) {
      if (isNewUser) {
        const userId = user.id

        const { id } = await stripe.customers.create({
          metadata: {
            userId
          }
        })

        await prisma.user.update({
          data: {
            planId: process.env.DEFAULT_PLAN_ID,
            stripeId: id
          },
          where: {
            id: userId
          }
        })
      }
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
