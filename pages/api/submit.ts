import cors from 'cors'
import { NextApiRequest, NextApiResponse } from 'next'
import connect from 'next-connect'

import { submitForm } from '@flyfly/server'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100kb'
    }
  }
}

const handler = connect<NextApiRequest, NextApiResponse>()
  .use(cors())
  .post(async (req, res) => {
    if (!req.headers['content-type'].startsWith('application/json')) {
      res.json({
        message: 'Body should be JSON',
        status: 'error'
      })

      return
    }

    const {
      body,
      query: { id }
    } = req

    const status = await submitForm(String(id), body)

    res.json({
      status
    })
  })

export default handler
