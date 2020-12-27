import { NextApiRequest, NextApiResponse } from 'next'
import connect from 'next-connect'

import { deleteResponse, getResponses, getUser } from '@flyfly/server'

const handler = connect<NextApiRequest, NextApiResponse>()
  .get(async (req, res) => {
    const user = await getUser(req)

    const { query } = req

    const formId = String(query.formId)
    const skip = Number(query.skip)

    const responses = await getResponses(user, formId, skip)

    res.json(responses)
  })
  .delete(async (req, res) => {
    const user = await getUser(req)

    const {
      query: { responseId }
    } = req

    await deleteResponse(user, String(responseId))

    res.json({
      status: 'ok'
    })
  })

export default handler
