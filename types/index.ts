// models

export type Plan = {
  id: string
  name: string
  price: number
  forms: number
  responses: number
  archive: number
  stripeId?: string
}

export type User = {
  id: string
  email: string
  name: string
  image: string
  verified: boolean
  emailNotifications: 'immediately' | 'daily' | 'weekly'
  planId: string
}

export type Project = {
  id: string
  name: string
  forms: number
  responses: number
  updatedAt: string
}

export type Form = {
  id: string
  slug: string
  projectId: string
  name: string
  responses: number
  updatedAt: string
}

export type Response = {
  id: string
  data: Record<string, unknown>
  createdAt: string
}

export type Usage = {
  count: number
  startsAt: string
  endsAt: string
}

// other

export type BatchMessage = {
  email: string
  data: {
    title: string
    projects: {
      project: string
      forms: {
        form: string
        responses: number
      }[]
    }[]
  }
}
