import { motion } from 'framer-motion'
import millify from 'millify'
import { GetServerSideProps, NextPage } from 'next'
import { useSession } from 'next-auth/client'
import Head from 'next/head'
import pluralize from 'pluralize'
import React, { useState } from 'react'
import Stripe from 'stripe'

import { GetStarted } from '@flyfly/components'
import { dollarDiscount, parsePlans } from '@flyfly/lib'
import { Plan } from '@flyfly/types'

interface Props {
  plans: Plan[]
}

const Pricing: NextPage<Props> = ({ plans }) => {
  const [session] = useSession()

  const [yearly, setYearly] = useState(false)

  return (
    <>
      <Head>
        <title>Pricing / FlyFly</title>
      </Head>

      <main className="landing justify-center text-center">
        <motion.header
          animate={{
            opacity: 1
          }}
          className="mt-8"
          initial={{
            opacity: 0
          }}
          transition={{
            duration: 0.2
          }}>
          <h1 className="text-4xl font-semibold">Pricing</h1>
          <p className="text-xl text-gray-700">Flexible pricing as you grow</p>
        </motion.header>

        <motion.div
          animate={{
            opacity: 1
          }}
          className="self-center bg-white rounded-lg shadow-sm overflow-hidden flex mt-16"
          initial={{
            opacity: 0
          }}
          transition={{
            delay: 0.2,
            duration: 0.2
          }}>
          <a
            className={`text-black py-2 px-3 ${yearly ? '' : 'bg-blue-200'}`}
            href="#montly"
            onClick={(event) => {
              event.preventDefault()

              setYearly(false)
            }}>
            Montly
          </a>
          <a
            className={`text-black py-2 px-3 ${yearly ? 'bg-blue-200' : ''}`}
            href="#yearly"
            onClick={(event) => {
              event.preventDefault()

              setYearly(true)
            }}>
            Yearly
          </a>
        </motion.div>

        <section className="flex flex-col lg:flex-row justify-center mt-4 lg:mt-16">
          {plans.map((plan, index) => (
            <motion.div
              animate={{
                opacity: 1
              }}
              className={`lg:w-1/4 px-8 mt-12 lg:mt-0 lg:ml-12 fly-${
                index === 0 ? 'four' : index === 1 ? 'one' : 'three'
              }`}
              initial={{
                opacity: 0
              }}
              key={plan.id}
              transition={{
                delay: 0.4 + 0.2 * index,
                duration: 0.2
              }}>
              <h2 className="text-2xl font-medium">{plan.name}</h2>
              {yearly ? (
                <div className="text-4xl font-semibold mt-2">
                  ${plan.priceYearly}
                  <span className="text-base font-normal text-gray-700">
                    /year
                  </span>
                  {plan.priceYearly > 0 && (
                    <span className="block font-medium text-xl mt-2">
                      {dollarDiscount(plan.priceMonthly, plan.priceYearly)} off
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-4xl font-semibold mt-2">
                  ${plan.priceMonthly}
                  <span className="text-base font-normal text-gray-700">
                    /month
                  </span>
                </div>
              )}
              <ul>
                <li className="text-gray-800 mt-2">
                  {millify(plan.responses)}{' '}
                  {pluralize('response', plan.responses)}
                </li>
                <li className="text-gray-800 mt-2">
                  {pluralize('form', plan.forms, true)}
                </li>
                <li className="text-gray-800 mt-2">&#8734; projects</li>
                <li className="text-gray-800 mt-2">
                  {plan.archiveDays} day archive
                </li>
              </ul>
            </motion.div>
          ))}
        </section>

        {!session && (
          <motion.section
            animate={{
              opacity: 1
            }}
            className="flex flex-col items-center mt-16"
            initial={{
              opacity: 0
            }}
            transition={{
              delay: 1,
              duration: 0.2
            }}>
            <GetStarted />
          </motion.section>
        )}
      </main>
    </>
  )
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27'
})

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const products = await stripe.products.list({
    active: true
  })

  const prices = await stripe.prices.list({
    active: true
  })

  const plans = parsePlans(products.data, prices.data)

  return {
    props: {
      plans
    }
  }
}

export default Pricing
