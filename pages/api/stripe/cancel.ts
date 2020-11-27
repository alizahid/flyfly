import dayjs from 'dayjs'
import { NextApiHandler } from 'next'
import { Stripe } from 'stripe'

import { getUser, mongo, MongoUser } from '@flyfly/server'

const handler: NextApiHandler = async (req, res) => {
  const { email } = await getUser(req, false)

  const db = await mongo()

  const user: MongoUser = await db.collection('users').findOne({
    email
  })

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27'
  })

  const { data } = await stripe.subscriptions.list({
    customer: user.stripeId
  })

  const subscription = data[0]

  const next = await stripe.subscriptions.update(subscription.id, {
    cancel_at_period_end: true
  })

  res.json({
    cancelAt: dayjs(next.cancel_at * 1000).toISOString()
  })
}

export default handler
