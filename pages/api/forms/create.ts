import { NextApiHandler } from 'next'

import { createForm, getUser } from '@flyfly/server'
import { Form } from '@flyfly/types'

const handler: NextApiHandler<Form> = async (req, res) => {
  const user = await getUser(req)

  const {
    body: { name, projectId }
  } = req

  const project = await createForm(user, projectId, name)

  res.json(project)
}

export default handler
