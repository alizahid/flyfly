import { buffer } from 'micro'
import { NextApiHandler } from 'next'
import { Stripe } from 'stripe'

import { getPlans, mongo, MongoUser, updateUser } from '@flyfly/server'

export const config = {
  api: {
    bodyParser: false
  }
}

const handler: NextApiHandler<{
  status: 'error' | 'ok'
}> = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('allow', 'POST')
    res.status(405).json({
      status: 'error'
    })

    return
  }

  const signature = req.headers['stripe-signature']

  if (!signature) {
    res.status(400).json({
      status: 'error'
    })

    return
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27'
  })

  const body = await buffer(req)

  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  )

  const db = await mongo()

  const user: MongoUser = await db.collection('users').findOne({
    stripeId: event.data.object['customer']
  })

  if (event.type === 'customer.subscription.updated') {
    const plans = await getPlans()

    const planId = event.data.object['plan'].id
    const status = event.data.object['status']

    if (status !== 'active') {
      res.status(400).json({
        status: 'error'
      })

      return
    }

    const plan = plans.find(({ stripeId }) => stripeId === planId)

    await updateUser(String(user._id), {
      planId: plan.id
    })
  }

  if (event.type === 'customer.subscription.deleted') {
    await updateUser(String(user._id), {
      planId: process.env.FREE_PLAN_ID
    })
  }

  res.json({
    status: 'ok'
  })
}

export default handler
