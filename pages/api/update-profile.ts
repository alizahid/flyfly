import { PrismaClient, User } from '@prisma/client'
import { NextApiHandler } from 'next'
import { getSession } from 'next-auth/client'

const prisma = new PrismaClient()

const handler: NextApiHandler<User> = async (req, res) => {
  const { user } = await getSession({
    req
  })

  const {
    body: { email, name }
  } = req

  const emailChanged = user.email !== email

  const next = await prisma.user.update({
    data: {
      email,
      emailVerified: emailChanged ? null : user.emailVerified,
      name
    },
    where: {
      id: user.id
    }
  })

  if (emailChanged) {
    // TODO: send verificaation email
  }

  res.json(next)
}

export default handler
