import axios from 'axios'
import { NextApiHandler } from 'next'

import {
  createJwt,
  createUser,
  getProfile,
  setTokenCookie
} from '@flyfly/server'

const handler: NextApiHandler = async (req, res) => {
  const {
    query: { code }
  } = req

  const {
    data: { access_token }
  } = await axios.request({
    data: {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code
    },
    headers: {
      accept: 'application/json'
    },
    method: 'post',
    url: 'https://github.com/login/oauth/access_token'
  })

  const {
    data: { avatar_url, name }
  } = await axios.request({
    headers: {
      authorization: `Bearer ${access_token}`
    },
    method: 'get',
    url: 'https://api.github.com/user'
  })

  const { data } = await axios.request({
    headers: {
      authorization: `Bearer ${access_token}`
    },
    method: 'get',
    url: 'https://api.github.com/user/emails'
  })

  const { email, verified } = data.find(
    ({ primary, verified }) => primary && verified
  )

  const exists = await getProfile(email)

  if (exists) {
    const token = createJwt(exists)

    setTokenCookie(res, token)

    res.redirect('/projects')

    return
  }

  const user = await createUser({
    email,
    image: avatar_url,
    name,
    verified
  })

  const token = createJwt(user)

  setTokenCookie(res, token)

  res.redirect('/projects')
}

export default handler
