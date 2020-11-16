import { NextApiHandler } from 'next'

import { deleteProject, getUser } from '@flyfly/server'

const handler: NextApiHandler = async (req, res) => {
  const user = await getUser(req)

  const {
    body: { projectId }
  } = req

  await deleteProject(user, projectId)

  res.json({
    status: 'ok'
  })
}

export default handler
