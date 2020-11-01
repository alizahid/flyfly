import { join } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'

import { prisma } from '../../lib'
import { DashboardProject } from '../../types'

export default async (
  req: NextApiRequest,
  res: NextApiResponse<DashboardProject>
): Promise<void> => {
  const { user } = await getSession({
    req
  })

  const slug = String(req.query.slug)

  const project = await prisma.project.findFirst({
    include: {
      forms: {
        orderBy: {
          createdAt: 'asc'
        }
      }
    },
    where: {
      slug,
      userId: user.id
    }
  })

  let responses: DashboardProject['responses']

  if (project.forms.length > 0) {
    responses = await prisma.$queryRaw`SELECT "formId", COUNT(id) AS count FROM "Response" WHERE "formId" IN (${join(
      project.forms.map(({ id }) => id)
    )}) GROUP BY "formId"`
  }

  res.json({
    ...project,
    responses
  })
}
