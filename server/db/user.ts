import { ObjectId } from 'mongodb'
import { Stripe } from 'stripe'

import { Plan, User } from '@flyfly/types'

import { mongo } from '.'
import { MongoUser } from './models'

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

export const getProfile = async (email: string): Promise<User> => {
  const db = await mongo()

  const user: MongoUser = await db.collection('users').findOne({
    email
  })

  if (!user) {
    return null
  }

  return parseUser(user)
}

export const createUser = async ({
  email,
  image,
  name,
  verified
}: Pick<MongoUser, 'email' | 'name' | 'image' | 'verified'>): Promise<User> => {
  const db = await mongo()

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27'
  })

  const customer = await stripe.customers.create({
    email,
    name
  })

  const data: Omit<MongoUser, '_id'> = {
    email,
    emailNotifications: 'immediately',
    image,
    name,
    planId: process.env.FREE_PLAN_ID,
    stripeId: customer.id,
    verified
  }

  const { insertedId } = await db.collection('users').insertOne(data)

  const user: MongoUser = await db.collection('users').findOne({
    _id: insertedId
  })

  return parseUser(user)
}

export const updateUser = async (
  userId: string,
  data: Partial<Pick<MongoUser, 'emailNotifications' | 'planId'>>
): Promise<User> => {
  const db = await mongo()

  const _id = new ObjectId(userId)

  await db.collection('users').updateOne(
    {
      _id
    },
    {
      $set: data
    }
  )

  const next: MongoUser = await db.collection('users').findOne({
    _id
  })

  return parseUser(next)
}
