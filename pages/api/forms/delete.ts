import { NextApiHandler } from 'next'

import { deleteForm, getUser } from '@flyfly/server'

const handler: NextApiHandler = async (req, res) => {
  const user = await getUser(req)

  const {
    body: { formId }
  } = req

  await deleteForm(user, formId)

  res.json({
    status: 'ok'
  })
}

export default handler
