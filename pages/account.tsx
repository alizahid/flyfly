import { motion } from 'framer-motion'
import { NextPage } from 'next'
import { useSession } from 'next-auth/client'
import Head from 'next/head'
import React from 'react'

import { GetStarted } from '@flyfly/components'

const Account: NextPage = () => {
  const [session] = useSession()

  return (
    <>
      <Head>
        <title>Account / FlyFly</title>
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

          <section className="flex flex-col lg:flex-row justify-center mt-16 mb-8">
            <motion.div
              animate={{
                opacity: 1
              }}
              className="fly-four lg:w-1/4 px-8"
              initial={{
                opacity: 0
              }}
              transition={{
                delay: 0.2,
                duration: 0.2
              }}>
              <h2 className="text-2xl font-medium">Free</h2>
              <h3 className="text-4xl font-semibold mt-2">$0</h3>
              <ul>
                <li className="text-gray-800 mt-2">100 submissions</li>
                <li className="text-gray-800 mt-2">10 forms</li>
                <li className="text-gray-800 mt-2">Unlimited projects</li>
                <li className="text-gray-800 mt-2">30 day retention</li>
              </ul>
            </motion.div>

            <motion.div
              animate={{
                opacity: 1
              }}
              className="fly-one lg:w-1/4 px-8 mt-12 lg:mt-0 lg:ml-12"
              initial={{
                opacity: 0
              }}
              transition={{
                delay: 0.4,
                duration: 0.2
              }}>
              <h2 className="text-2xl font-medium">Basic</h2>
              <h3 className="text-4xl font-semibold mt-2">$10</h3>
              <ul>
                <li className="text-gray-800 mt-2">1,000 submissions</li>
                <li className="text-gray-800 mt-2">25 forms</li>
                <li className="text-gray-800 mt-2">Unlimited projects</li>
                <li className="text-gray-800 mt-2">90 day retention</li>
              </ul>
            </motion.div>

            <motion.div
              animate={{
                opacity: 1
              }}
              className="fly-three lg:w-1/4 px-8 mt-12 lg:mt-0 lg:ml-12"
              initial={{
                opacity: 0
              }}
              transition={{
                delay: 0.6,
                duration: 0.2
              }}>
              <h2 className="text-2xl font-medium">Pro</h2>
              <h3 className="text-4xl font-semibold mt-2">$20</h3>
              <ul>
                <li className="text-gray-800 mt-2">10,000 submissions</li>
                <li className="text-gray-800 mt-2">100 forms</li>
                <li className="text-gray-800 mt-2">Unlimited projects</li>
                <li className="text-gray-800 mt-2">365 day retention</li>
              </ul>
            </motion.div>
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

export default Account
