import { motion } from 'framer-motion'
import millify from 'millify'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import pluralize from 'pluralize'
import React from 'react'

import { GetStarted } from '@flyfly/components'
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

    <main className="bg-white rounded-xl shadow-sm py-16 justify-center text-center">
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
        <p className="text-xl text-gray-700 mt-2">
          Flexible pricing as you grow
        </p>
      </motion.header>

      <section className="grid lg:grid-cols-3 lg:mx-auto gap-16 mt-16">
        {plans.map((plan, index) => (
          <motion.div
            animate={{
              opacity: 1
            }}
            className={`flex flex-col items-center justify-center rounded-2xl shadow-sm py-16 lg:px-16 bg-gradient-to-br ${
              index % 3 === 0
                ? 'from-green-200 to-green-300'
                : index % 3 === 1
                ? 'from-violet-200 to-violet-300'
                : 'from-blue-200 to-blue-300'
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
            <h3 className="text-4xl font-semibold mt-2">
              ${plan.price}
              <span className="text-sm font-normal text-gray-600">/m</span>
            </h3>
            <ul>
              <li className="text-gray-800 mt-2">
                {millify(plan.responses)}{' '}
                {pluralize('response', plan.responses)}
                <span className="text-sm text-gray-600">/m</span>
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
