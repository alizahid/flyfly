import { PrismaClient } from '@prisma/client'
import { NextApiHandler } from 'next'
import { getSession } from 'next-auth/client'

import { generateSlug } from '@flyfly/lib'
import { ProjectWithFormCount } from '@flyfly/types'

const prisma = new PrismaClient()

const handler: NextApiHandler<ProjectWithFormCount> = async (req, res) => {
  const { user } = await getSession({
    req
  })

  const {
    body: { name }
  } = req

  const project = await prisma.project.create({
    data: {
      name,
      slug: generateSlug(),
      user: {
        connect: {
          id: user.id
        }
      }
    }
  })

  res.json({
    ...project,
    forms: 0
  })
}

export default handler
