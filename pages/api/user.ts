import { NextApiRequest, NextApiResponse } from 'next'
import connect from 'next-connect'

import { getUser, updateUser } from '@flyfly/server'

const handler = connect<NextApiRequest, NextApiResponse>()
  .get(async (req, res) => {
    const user = await getUser(req)

    res.json(user)
  })
  .put(async (req, res) => {
    const user = await getUser(req)

    const {
      body: { emailNotifications }
    } = req

    if (!['immediately', 'daily', 'weekly'].includes(emailNotifications)) {
      throw new Error('Invalid interval')
    }

    const next = await updateUser(user.id, {
      emailNotifications
    })

    res.json(next)
  })

export default handler
