import { Plan } from '@flyfly/types'

import { mongo } from '.'
import { MongoPlan } from './models'

const parsePlan = ({
  archive,
  forms,
  name,
  price,
  responses,
  slug,
  stripeId
}: MongoPlan): Plan => ({
  archive,
  forms,
  id: slug,
  name,
  price,
  responses,
  stripeId: stripeId ?? null
})

export const getPlans = async (): Promise<Plan[]> => {
  const db = await mongo()

  const plans: MongoPlan[] = await db
    .collection('plans')
    .find({
      visible: true
    })
    .sort({
      price: 1
    })
    .toArray()

  return plans.map(parsePlan)
}

export const getPlan = async (slug: string): Promise<Plan> => {
  const db = await mongo()

  const plan: MongoPlan = await db.collection('plans').findOne({
    slug
  })

  if (!plan) {
    return null
  }

  return parsePlan(plan)
}
