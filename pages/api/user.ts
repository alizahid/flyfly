import { NextApiRequest, NextApiResponse } from 'next'
import connect from 'next-connect'

import { getUser, updateUser } from '@flyfly/server'

const handler = connect<NextApiRequest, NextApiResponse>().put(
  async (req, res) => {
    const user = await getUser(req)

    const {
      body: { emailNotifications }
    } = req

    if (!['immediate', 'daily', 'weekly'].includes(emailNotifications)) {
      throw new Error('Invalid interval')
    }

    const next = await updateUser(user, {
      emailNotifications
    })

    res.json(next)
  }
)

export default handler
