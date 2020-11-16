import { ObjectId } from 'mongodb'

export type MongoPlan = {
  _id: ObjectId
  slug: string
  name: string
  price: number
  stripeId: string
  forms: number
  responses: number
  archive: number
  visible: boolean
}

export type MongoUser = {
  _id: ObjectId
  name: string
  email: string
  image: string
  verified: boolean
  planId: string
}

export type MongoProject = {
  _id: ObjectId
  name: string
  userId: string
  updatedAt: Date
}

export type MongoForm = {
  _id: ObjectId
  slug: string
  name: string
  projectId: ObjectId
  userId: ObjectId
  updatedAt: Date
}

export type MongoResponse = {
  _id: ObjectId
  data: Record<string, unknown>
  formId: ObjectId
  projectId: ObjectId
  userId: ObjectId
  createdAt: Date
}
