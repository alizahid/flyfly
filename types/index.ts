export type Plan = {
  id: string
  name: string
  price: number
  forms: number
  responses: number
  archive: number
}

export type User = {
  id: string
  email: string
  name: string
  image: string
  verified: boolean
  plan?: Plan
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
