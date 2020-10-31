import Prisma from '@prisma/client'
import * as auth from 'next-auth'

declare module 'next-auth' {
  interface User extends Prisma.User {}
}
