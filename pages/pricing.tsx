import { Plan, PrismaClient } from '@prisma/client'
import { AnimatePresence, motion } from 'framer-motion'
import millify from 'millify'
import { GetStaticProps, NextPage } from 'next'
import { useSession } from 'next-auth/client'
import Head from 'next/head'
import pluralize from 'pluralize'
import React, { useState } from 'react'

import { Counter, GetStarted, Spinner } from '@flyfly/components'
import { serializeJson } from '@flyfly/lib'

interface Props {
  plans: Plan[]
}

const Pricing: NextPage<Props> = ({ plans }) => {
  const [session, loading] = useSession()

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
          className="mt-8 mx-8"
          initial={{
            opacity: 0
          }}
          transition={{
            duration: 0.2
          }}>
          <h1 className="text-4xl font-semibold">Pricing</h1>
          <p className="text-xl text-gray-700">
            Everything is unlimited during the beta period
          </p>
        </motion.header>

        <motion.div
          animate={{
            opacity: 1
          }}
          className="self-center bg-white rounded-lg shadow-sm leading-none flex mt-16 p-1"
          initial={{
            opacity: 0
          }}
          transition={{
            delay: 0.2,
            duration: 0.2
          }}>
          <button
            className={`static text-black cursor-pointer p-2 rounded ${
              yearly ? '' : 'bg-blue-200'
            }`}
            onClick={(event) => {
              event.preventDefault()

              setYearly(false)
            }}>
            Montly
          </button>
          <button
            className={`static text-black cursor-pointer p-2 rounded ${
              yearly ? 'bg-blue-200' : ''
            }`}
            onClick={(event) => {
              event.preventDefault()

              setYearly(true)
            }}>
            Yearly
          </button>
        </motion.div>

        <section className="flex flex-col lg:flex-row justify-center mt-4 lg:mt-16 mb-8">
          {plans.map((plan, index) => (
            <motion.div
              animate={{
                opacity: 1
              }}
              className={`flex flex-col items-center justify-center lg:w-1/4 px-8 mt-12 lg:mt-0 lg:ml-12 fly-${
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
                <Counter
                  value={
                    plan.price * (yearly ? 12 : 1) -
                    (yearly ? plan.price * 12 * 0.2 : 0)
                  }
                />
              </div>
              <AnimatePresence>
                {yearly && plan.price * 12 - plan.price * 12 * 0.2 > 0 && (
                  <motion.div
                    animate={{
                      height: 'auto'
                    }}
                    className="overflow-hidden font-medium text-xl line-through text-gray-700"
                    exit={{
                      height: 0
                    }}
                    initial={{
                      height: 0
                    }}
                    transition={{
                      duration: 0.2
                    }}>
                    ${plan.price * 12}
                  </motion.div>
                )}
              </AnimatePresence>
              <ul>
                <li className="text-gray-800 mt-2">
                  {millify(plan.responses)}{' '}
                  {pluralize('response', plan.responses)}
                  <span className="text-sm text-gray-700">/month</span>
                </li>
                <li className="text-gray-800 mt-2">
                  {pluralize('form', plan.forms, true)}
                </li>
                <li className="text-gray-800 mt-2">&#8734; projects</li>
              </ul>
            </motion.div>
          ))}
        </section>

        {loading ? (
          <Spinner className="mt-16 mx-auto" />
        ) : (
          !session && (
            <motion.section
              animate={{
                opacity: 1
              }}
              className="flex flex-col items-center mb-8 mt-16"
              initial={{
                opacity: 0
              }}
              transition={{
                delay: 1,
                duration: 0.2
              }}>
              <GetStarted />
            </motion.section>
          )
        )}
      </main>
    </>
  )
}

const prisma = new PrismaClient()

export const getStaticProps: GetStaticProps<Props> = async () => {
  const plans = await prisma.plan.findMany({
    orderBy: {
      price: 'asc'
    }
  })

  return {
    props: {
      plans: serializeJson(plans)
    }
  }
}

export default Pricing
