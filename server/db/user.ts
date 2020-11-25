import { ObjectId } from 'mongodb'

import { Plan, User } from '@flyfly/types'

import { mongo } from '.'
import { MongoUser } from './models'
import { getPlan } from './plan'

const parseUser = ({
  _id,
  email,
  emailNotifications,
  image,
  name,
  plan,
  planId,
  verified
}: MongoUser & {
  plan?: Plan
}): User => ({
  email,
  emailNotifications,
  id: String(_id),
  image,
  name,
  plan: plan || null,
  planId,
  verified
})

export const getProfile = async (
  email: string,
  withPlan?: boolean
): Promise<User> => {
  const db = await mongo()

  const user: MongoUser = await db.collection('users').findOne({
    email
  })

  if (!user) {
    return null
  }

  let plan: Plan

  if (withPlan) {
    plan = await getPlan(user.planId)
  }

  return parseUser({
    ...user,
    plan
  })
}

export const createUser = async ({
  email,
  image,
  name,
  verified
}: Pick<MongoUser, 'email' | 'name' | 'image' | 'verified'>): Promise<User> => {
  const db = await mongo()

  const data: Omit<MongoUser, '_id'> = {
    email,
    emailNotifications: 'immediately',
    image,
    name,
    planId: process.env.FREE_PLAN_ID,
    verified
  }

  const { insertedId } = await db.collection('users').insertOne(data)

  const user: MongoUser = await db.collection('users').findOne({
    _id: insertedId
  })

  return parseUser(user)
}

export const updateUser = async (
  user: User,
  { emailNotifications }: Pick<MongoUser, 'emailNotifications'>
): Promise<User> => {
  const db = await mongo()

  const _id = new ObjectId(user.id)

  await db.collection('users').updateOne(
    {
      _id
    },
    {
      $set: {
        emailNotifications
      }
    }
  )

  const next: MongoUser = await db.collection('users').findOne({
    _id
  })

  return parseUser(next)
}
