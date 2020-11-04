import { orderBy } from 'lodash'
import { generate } from 'shortid'
import Stripe from 'stripe'

import { Plan } from '@flyfly/types'

export const serializeJson = <T>(data: T): T => JSON.parse(JSON.stringify(data))

export const generateSlug = (): string => {
  const slug = generate()

  if (slug.includes('-') || slug.includes('_')) {
    return generateSlug()
  }

  return slug
}

export const parseValue = (
  data: unknown
): {
  data: string
  mono: boolean
} => {
  const result = {
    data: String(data),
    mono: false
  }

  if (Array.isArray(data)) {
    if (typeof data[0] === 'object') {
      result.mono = true
      result.data = JSON.stringify(data, null, 2)
    }

    result.data = data.join(', ')
  }

  if (typeof data === 'object') {
    result.mono = true
    result.data = JSON.stringify(data, null, 2)
  }

  if (typeof data === 'boolean') {
    result.data = data ? 'Yes' : 'No'
  }

  return result
}

export const prettyLanguageName = (language: string): string => {
  switch (language) {
    case 'typescript':
      return 'TypeScript'

    default:
      return language
  }
}

export const parsePlans = (
  products: Stripe.Product[],
  prices: Stripe.Price[]
): Plan[] =>
  orderBy(
    products.map(
      ({ id, metadata: { archiveDays, forms, responses }, name }) => {
        const pricesForPlan = prices.filter((price) => price.product === id)

        const monthly = pricesForPlan.find(
          ({ recurring: { interval } }) => interval === 'month'
        )

        const yearly = pricesForPlan.find(
          ({ recurring: { interval } }) => interval === 'year'
        )

        return {
          archiveDays: Number(archiveDays),
          forms: Number(forms),
          id,
          name,
          priceMonthly: monthly ? monthly.unit_amount / 100 : 0,
          priceYearly: yearly ? yearly.unit_amount / 100 : 0,
          responses: Number(responses)
        }
      }
    ),
    'priceMonthly',
    'asc'
  )

export const dollarDiscount = (
  priceMonthly: number,
  priceYearly: number
): string => `$${priceMonthly * 12 - priceYearly}`

export const percentDiscount = (
  priceMonthly: number,
  priceYearly: number
): string =>
  `${((priceMonthly * 12 - priceYearly) / (priceMonthly * 12)) * 100}%`
