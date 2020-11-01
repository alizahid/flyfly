import { Form, Project } from '@prisma/client'

export type DashboardProject = Project & {
  forms: Form[]
  responses?: {
    formId: number
    count: number
  }[]
}
