import { Plan, PrismaClient } from '@prisma/client'
import { motion } from 'framer-motion'
import millify from 'millify'
import { GetServerSideProps, NextPage } from 'next'
import { useSession } from 'next-auth/client'
import Head from 'next/head'
import pluralize from 'pluralize'
import React from 'react'

import { GetStarted } from '@flyfly/components'

interface Props {
  plans: Plan[]
}

const Pricing: NextPage<Props> = ({ plans }) => {
  const [session] = useSession()

  return (
    <>
      <Head>
        <title>Pricing / FlyFly</title>
      </Head>

      <main className="landing justify-center text-center">
        <div>
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
            <p className="text-xl text-gray-700">
              Flexible pricing as you grow
            </p>
          </motion.header>

          <section className="flex flex-col lg:flex-row justify-center mt-4 lg:mt-16 mb-8">
            {plans.map((plan) => (
              <motion.div
                animate={{
                  opacity: 1
                }}
                className={`lg:w-1/4 px-8 mt-12 lg:mt-0 lg:ml-12 fly-${
                  plan.id === 'free'
                    ? 'four'
                    : plan.id === 'basic'
                    ? 'one'
                    : 'three'
                }`}
                initial={{
                  opacity: 0
                }}
                key={plan.id}
                transition={{
                  delay: 0.2,
                  duration: 0.2
                }}>
                <h2 className="text-2xl font-medium">{plan.name}</h2>
                <h3 className="text-4xl font-semibold mt-2">
                  ${plan.price}
                  <span className="block text-base text-gray-700">/month</span>
                </h3>
                <ul>
                  <li className="text-gray-800 mt-2">
                    {millify(plan.submissions)}{' '}
                    {pluralize('response', plan.submissions)}
                  </li>
                  <li className="text-gray-800 mt-2">
                    {pluralize('form', plan.forms, true)}
                  </li>
                  <li className="text-gray-800 mt-2">Unlimited projects</li>
                  <li className="text-gray-800 mt-2">
                    {plan.archive} day archive
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
                delay: 0.8,
                duration: 0.2
              }}>
              <GetStarted />
            </motion.section>
          )}
        </div>
      </main>
    </>
  )
}

const prisma = new PrismaClient()

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const plans = await prisma.plan.findMany({
    orderBy: {
      price: 'asc'
    },
    where: {
      visible: true
    }
  })

  return {
    props: {
      plans
    }
  }
}

export default Pricing
