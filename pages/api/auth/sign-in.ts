import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?scope=user:email&client_id=${process.env.GITHUB_CLIENT_ID}`
  )
}

export default handler
