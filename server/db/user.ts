import { Plan, User } from '@flyfly/types'

import { mongo } from '.'
import { MongoUser } from './models'
import { getPlan } from './plan'

const parseUser = ({
  _id,
  email,
  image,
  name,
  plan,
  verified
}: MongoUser & {
  plan?: Plan
}): User => ({
  email,
  id: String(_id),
  image,
  name,
  plan: plan || null,
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

  const { insertedId } = await db.collection('users').insertOne({
    email,
    image,
    name,
    planId: process.env.FREE_PLAN_ID,
    verified
  })

  const user: MongoUser = await db.collection('users').findOne({
    _id: insertedId
  })

  return parseUser(user)
}
