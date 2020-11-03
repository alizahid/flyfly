import { PrismaClient } from '@prisma/client'
import { NextApiHandler } from 'next'
import { getSession } from 'next-auth/client'

const prisma = new PrismaClient()

const handler: NextApiHandler<boolean> = async (req, res) => {
  const { user } = await getSession({
    req
  })

  const {
    body: { slug }
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

  await prisma.response.deleteMany({
    where: {
      formId: form.id
    }
  })

  await prisma.form.delete({
    where: {
      id: form.id
    }
  })

  res.json(true)
}

export default handler
