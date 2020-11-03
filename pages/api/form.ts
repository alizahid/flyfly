import { PrismaClient } from '@prisma/client'
import { NextApiHandler } from 'next'

const prisma = new PrismaClient()

const handler: NextApiHandler<{
  status: 'ok' | 'error'
}> = async (req, res) => {
  const {
    body,
    query: { slug }
  } = req

  try {
    await prisma.response.create({
      data: {
        data: body,
        form: {
          connect: {
            slug: String(slug)
          }
        },
        meta: {}
      }
    })

    res.json({
      status: 'ok'
    })
  } catch {
    res.status(500).json({
      status: 'error'
    })
  }
}

export default handler
