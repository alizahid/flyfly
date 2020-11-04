import Prisma from '@prisma/client'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as auth from 'next-auth'

declare module 'next-auth' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface User extends Prisma.User {}
}

declare namespace NodeJS {
  export interface ProcessEnv {
    NEXTAUTH_URL: string
    STRIPE_KEY: string
    STRIPE_SECRET_KEY: string
  }
}
