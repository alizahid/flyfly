import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'

import { prisma } from '../../lib'
import { DashboardProject } from '../../types'

export default async (
  req: NextApiRequest,
  res: NextApiResponse<DashboardProject[]>
): Promise<void> => {
  const { user } = await getSession({
    req
  })

  const projects = await prisma.project.findMany({
    include: {
      forms: true
    },
    orderBy: {
      createdAt: 'asc'
    },
    where: {
      userId: user.id
    }
  })

  res.json(projects)
}
