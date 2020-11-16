import { NextApiHandler } from 'next'

import { getResponses, getUser } from '@flyfly/server'
import { Response } from '@flyfly/types'

const handler: NextApiHandler<Response[]> = async (req, res) => {
  const user = await getUser(req)

  const { query } = req

  const formId = String(query.formId)
  const skip = Number(query.skip)

  const responses = await getResponses(user, formId, skip)

  res.json(responses)
}

export default handler
