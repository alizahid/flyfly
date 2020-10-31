import { join, PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

export const formsForProject = async (
  projects: number[]
): Promise<
  Array<{
    id: number
    projectId: number
    count: number
  }>
> =>
  prisma.$queryRaw`SELECT id, "projectId", COUNT(id) FROM "Form" WHERE "projectId" IN (${join(
    projects
  )}) GROUP BY id, "projectId"`

export const responsesForForms = async (
  forms: number[]
): Promise<
  Array<{
    formId: number
    count: number
  }>
> =>
  prisma.$queryRaw`SELECT "formId", COUNT(id) FROM "Response" WHERE "formId" IN (${join(
    forms
  )}) GROUP BY "formId"`
