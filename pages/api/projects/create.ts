import { NextApiHandler } from 'next'

import { createProject, getUser } from '@flyfly/server'
import { Project } from '@flyfly/types'

const handler: NextApiHandler<Project> = async (req, res) => {
  const user = await getUser(req)

  const {
    body: { name }
  } = req

  const project = await createProject(user, name)

  res.json(project)
}

export default handler
