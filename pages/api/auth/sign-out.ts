import { NextApiHandler } from 'next'

import { deleteTokenCookie } from '@flyfly/server'

const handler: NextApiHandler = async (req, res) => {
  deleteTokenCookie(res)

  res.redirect('/')
}

export default handler
