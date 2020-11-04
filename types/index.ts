import { Form, Project, Response, User } from '@prisma/client'

export type ProjectWithFormCount = Project & {
  forms: number
}

export type ProjectWithFormsWithResponseCount = Project & {
  forms: FormWithResponseCount[]
}

export type FormWithResponseCount = Form & {
  responses: number
}

export type FormWithResponses = Form & {
  responses: Response[]
}

export type Plan = {
  id: string
  archiveDays: number
  forms: number
  name: string
  priceMonthly: number
  priceYearly: number
  responses: number
}

export type Profile = User & {
  plan: Plan
}
