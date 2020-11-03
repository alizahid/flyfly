import { Form, Project, Response } from '@prisma/client'

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
