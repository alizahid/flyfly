import { Project } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'

import { prisma } from '../../lib'

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Project[]>
): Promise<void> => {
  const { user } = await getSession({
    req
  })

  const projects = await prisma.project.findMany({
    where: {
      userId: user.id
    }
  })

  res.json(projects)
}
