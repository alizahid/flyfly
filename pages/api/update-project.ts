import { PrismaClient, Project } from '@prisma/client'
import { NextApiHandler } from 'next'
import { getSession } from 'next-auth/client'

const prisma = new PrismaClient()

const handler: NextApiHandler<Project> = async (req, res) => {
  const { user } = await getSession({
    req
  })

  const {
    body: { name, slug }
  } = req

  const project = await prisma.project.findFirst({
    where: {
      slug,
      userId: user.id
    }
  })

  if (!project) {
    throw new Error('Project not found')
  }

  const next = await prisma.project.update({
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
