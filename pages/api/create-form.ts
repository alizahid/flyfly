import { PrismaClient } from '@prisma/client'
import { NextApiHandler } from 'next'
import { getSession } from 'next-auth/client'

import { generateSlug } from '@flyfly/lib'
import { FormWithResponseCount } from '@flyfly/types'

const prisma = new PrismaClient()

const handler: NextApiHandler<FormWithResponseCount> = async (req, res) => {
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

  const form = await prisma.form.create({
    data: {
      name,
      project: {
        connect: {
          slug
        }
      },
      slug: generateSlug()
    }
  })

  res.json({
    ...form,
    responses: 0
  })
}

export default handler
