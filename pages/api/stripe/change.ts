import { NextApiHandler } from 'next'
import { Stripe } from 'stripe'

import { getPlans, getUser, mongo, MongoUser } from '@flyfly/server'

const handler: NextApiHandler<{
  sessionId?: string
  planId?: string
}> = async (req, res) => {
  const { email } = await getUser(req, false)

  const {
    body: { priceId }
  } = req

  const plans = await getPlans()

  if (
    !plans
      .map(({ stripeId }) => stripeId)
      .filter(Boolean)
      .includes(priceId)
  ) {
    throw new Error('Invalid plan')
  }

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

  const hasSubscription = data.length > 0

  if (hasSubscription) {
    const subscription = data[0]

    await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: false,
      items: [
        {
          id: subscription.items.data[0].id,
          price: priceId
        }
      ],
      proration_behavior: 'create_prorations'
    })

    const plan = plans.find(({ stripeId }) => stripeId === priceId)

    res.json({
      planId: plan.id
    })

    return
  }

  const session = await stripe.checkout.sessions.create({
    cancel_url: `${process.env.URL}/account`,
    customer: user.stripeId,
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    mode: 'subscription',
    payment_method_types: ['card'],
    success_url: `${process.env.URL}/account`
  })

  res.json({
    sessionId: session.id
  })
}

export default handler
