import { NextApiHandler } from 'next'

import { submitForm } from '@flyfly/server'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100kb'
    }
  }
}

const handler: NextApiHandler<{
  message?: string
  status: 'ok' | 'error'
}> = async (req, res) => {
  if (req.method.toLowerCase() !== 'post') {
    res.json({
      message: 'Method should be POST',
      status: 'error'
    })

    return
  }

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
}

export default handler
