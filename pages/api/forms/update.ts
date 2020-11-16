import { NextApiHandler } from 'next'

import { getUser, updateForm } from '@flyfly/server'
import { Form } from '@flyfly/types'

const handler: NextApiHandler<Form> = async (req, res) => {
  const user = await getUser(req)

  const {
    body: { formId, name }
  } = req

  const project = await updateForm(user, formId, name)

  res.json(project)
}

export default handler
