import { PrismaClient } from '@prisma/client'
import { generateSlug } from 'lib/helpers'
import { NextApiHandler } from 'next'
import { getSession } from 'next-auth/client'

import { DashboardProject } from '@flyfly/types'

const prisma = new PrismaClient()

const handler: NextApiHandler<DashboardProject> = async (req, res) => {
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
    },
    include: {
      forms: true
    }
  })

  res.json(project)
}

export default handler
