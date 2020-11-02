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

  const project = await prisma.project.findFirst({
    include: {
      forms: true
    },
    where: {
      slug,
      userId: user.id
    }
  })

  if (!project) {
    throw new Error('Project not found')
  }

  await prisma.response.deleteMany({
    where: {
      formId: {
        in: project.forms.map(({ id }) => id)
      }
    }
  })

  await prisma.form.deleteMany({
    where: {
      projectId: project.id
    }
  })

  await prisma.project.delete({
    where: {
      id: project.id
    }
  })

  res.json(true)
}

export default handler
