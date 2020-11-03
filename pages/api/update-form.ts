import { Form, PrismaClient } from '@prisma/client'
import { NextApiHandler } from 'next'
import { getSession } from 'next-auth/client'

const prisma = new PrismaClient()

const handler: NextApiHandler<Form> = async (req, res) => {
  const { user } = await getSession({
    req
  })

  const {
    body: { name, slug }
  } = req

  const form = await prisma.form.findOne({
    include: {
      project: {
        include: {
          user: true
        }
      }
    },
    where: {
      slug
    }
  })

  if (!form) {
    throw new Error('Form not found')
  }

  if (form.project.user.id !== user.id) {
    throw new Error('Form not found')
  }

  const next = await prisma.form.update({
    data: {
      name
    },
    where: {
      slug
    }
  })

  res.json(next)
}

export default handler
