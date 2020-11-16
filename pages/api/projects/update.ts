import { NextApiHandler } from 'next'

import { getUser, updateProject } from '@flyfly/server'
import { Project } from '@flyfly/types'

const handler: NextApiHandler<Project> = async (req, res) => {
  const user = await getUser(req)

  const {
    body: { name, projectId }
  } = req

  const project = await updateProject(user, projectId, name)

  res.json(project)
}

export default handler
