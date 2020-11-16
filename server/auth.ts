import { sign, verify } from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse, NextPageContext } from 'next'
import { destroyCookie, parseCookies, setCookie } from 'nookies'

import { User } from '@flyfly/types'

import { getProfile } from './db'

// jwt

export const createJwt = (user: User): string =>
  sign(user.email, process.env.TOKEN_SECRET)

export const verifyJwt = (token: string): string =>
  verify(token, process.env.TOKEN_SECRET) as string

// cookie

const cookieOptions = {
  domain: process.env.NODE_ENV === 'production' ? 'flyfly.dev' : 'localhost',
  httpOnly: true,
  path: '/',
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production'
}

export const getTokenFromCookie = (
  req: NextApiRequest | NextPageContext['req']
): string => {
  const { token } = parseCookies(
    {
      req
    },
    cookieOptions
  )

  return token
}

export const setTokenCookie = (res: NextApiResponse, token: string): void => {
  setCookie(
    {
      res
    },
    'token',
    token,
    cookieOptions
  )
}

export const deleteTokenCookie = (res: NextApiResponse): void => {
  destroyCookie(
    {
      res
    },
    'token',
    cookieOptions
  )
}

// auth

export const getUser = async (
  req: NextPageContext['req'],
  withPlan?: boolean
): Promise<User | null> => {
  try {
    const token = getTokenFromCookie(req)

    const email = verifyJwt(token)

    const user = await getProfile(email, withPlan)

    return user
  } catch {
    return null
  }
}
