import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

export const serializeJson = <T>(data: T): T => JSON.parse(JSON.stringify(data))
