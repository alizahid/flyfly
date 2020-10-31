import { sumBy } from 'lodash'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'

import { formsForProject, prisma, responsesForForms } from '../../lib'
import { DashboardProject } from '../../types'

export default async (
  req: NextApiRequest,
  res: NextApiResponse<DashboardProject[]>
): Promise<void> => {
  const { user } = await getSession({
    req
  })

  const projects = await prisma.project.findMany({
    orderBy: {
      updatedAt: 'desc'
    },
    where: {
      userId: user.id
    }
  })

  const forms = await formsForProject(projects.map(({ id }) => id))

  const responses = await responsesForForms(forms.map(({ id }) => id))

  const data = projects.map(({ id, name, slug }) => {
    const projectForms = forms.filter(({ projectId }) => id === projectId)

    const projectResponses = responses.filter(({ formId }) =>
      projectForms.map(({ id }) => id).includes(formId)
    )

    return {
      forms: sumBy(projectForms, 'count'),
      id,
      name,
      responses: sumBy(projectResponses, 'count'),
      slug
    }
  })

  res.json(data)
}
