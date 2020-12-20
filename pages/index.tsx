import { motion } from 'framer-motion'
import { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import React from 'react'

import { GetStarted, Spinner } from '@flyfly/components'
import { useSession } from '@flyfly/hooks'

const Home: NextPage = () => {
  const { loading, user } = useSession()

  return (
    <>
      <Head>
        <title>FlyFly: Super easy headless forms</title>
      </Head>

      <main className="bg-white rounded-xl shadow-sm py-16 justify-center text-center">
        <motion.header
          animate={{
            opacity: 1
          }}
          initial={{
            opacity: 0
          }}
          transition={{
            duration: 0.2
          }}>
          <Image
            alt="FlyFly"
            className="m-auto"
            height={160}
            src="/img/flyfly.svg"
            width={160}
          />
          <h1 className="text-4xl font-semibold mt-8">FlyFly</h1>
          <div className="text-gray-700 mt-2">Super easy headless forms</div>
        </motion.header>

        <section className="grid lg:grid-cols-2 gap-8 mx-auto lg:w-2/3 mt-16">
          <motion.div
            animate={{
              opacity: 1
            }}
            initial={{
              opacity: 0
            }}
            transition={{
              delay: 0.2,
              duration: 0.2
            }}>
            <h2 className="text-2xl font-semibold">How it works</h2>
            <ul>
              <li className="mt-2 text-gray-700">
                Create a project and add a form
              </li>
              <li className="mt-2 text-gray-700">
                Send a POST request to our API
              </li>
              <li className="mt-2 text-gray-700">Done!</li>
            </ul>
          </motion.div>

          <motion.div
            animate={{
              opacity: 1
            }}
            initial={{
              opacity: 0
            }}
            transition={{
              delay: 0.4,
              duration: 0.2
            }}>
            <h2 className="text-2xl font-semibold">Works everywhere</h2>
            <ul>
              <li className="mt-2 text-gray-700">
                React, Next.js, React Native
              </li>
              <li className="mt-2 text-gray-700">iOS, Android</li>
              <li className="mt-2 text-gray-700">
                Pretty much everywhere else!
              </li>
            </ul>
          </motion.div>
        </section>

        {loading ? (
          <Spinner className="mx-auto mt-16" />
        ) : user ? null : (
          <motion.section
            animate={{
              opacity: 1
            }}
            className="flex flex-col items-center mt-16"
            initial={{
              opacity: 0
            }}
            transition={{
              duration: 0.2
            }}>
            <GetStarted />
          </motion.section>
        )}
      </main>
    </>
  )
}

export default Home
