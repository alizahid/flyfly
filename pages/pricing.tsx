import { motion } from 'framer-motion'
import millify from 'millify'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import pluralize from 'pluralize'
import React from 'react'

import { Counter, GetStarted } from '@flyfly/components'
import { getPlans, getUser } from '@flyfly/server'
import { Plan, User } from '@flyfly/types'

interface Props {
  plans: Plan[]
  user?: User
}

const Pricing: NextPage<Props> = ({ plans, user }) => (
  <>
    <Head>
      <title>Pricing / FlyFly</title>
    </Head>

    <main className="full justify-center text-center">
      <motion.header
        animate={{
          opacity: 1
        }}
        className="mx-8"
        initial={{
          opacity: 0
        }}
        transition={{
          duration: 0.2
        }}>
        <h1 className="text-4xl font-semibold">Pricing</h1>
        <p className="text-xl text-gray-700">Flexible pricing as you grow</p>
      </motion.header>

      <section className="grid lg:grid-cols-3 gap-16 mt-16">
        {plans.map((plan, index) => (
          <motion.div
            animate={{
              opacity: 1
            }}
            className={`flex flex-col items-center justify-center  fly-${
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
            <div className="text-4xl font-semibold">
              $
              <Counter value={plan.price} />
            </div>
            <ul>
              <li className="text-gray-800 mt-2">
                {millify(plan.responses)}{' '}
                {pluralize('response', plan.responses)}
                <span className="text-sm text-gray-700">/month</span>
              </li>
              <li className="text-gray-800 mt-2">
                {pluralize('form', plan.forms, true)}
              </li>
              <li className="text-gray-800 mt-2">
                <span title="Unlimited">&#8734;</span> projects
              </li>
              <li className="text-gray-800 mt-2">{plan.archive} day archive</li>
            </ul>
          </motion.div>
        ))}
      </section>

      {!user && (
        <motion.section
          animate={{
            opacity: 1
          }}
          className="self-center mt-16"
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

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req
}) => {
  const user = await getUser(req)
  const plans = await getPlans()

  return {
    props: {
      plans,
      user
    }
  }
}

export default Pricing
