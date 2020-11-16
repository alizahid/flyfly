import { motion } from 'framer-motion'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import React from 'react'

import { GetStarted } from '@flyfly/components'
import { getUser } from '@flyfly/server'
import { User } from '@flyfly/types'

interface Props {
  user?: User
}

const Home: NextPage<Props> = ({ user }) => (
  <>
    <Head>
      <title>FlyFly: Super easy headless forms</title>
    </Head>

    <main className="fly-one justify-center text-center">
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
        <img alt="FlyFly" className="w-40 m-auto" src="/img/flyfly.svg" />
        <h1 className="text-4xl font-semibold mt-8">FlyFly</h1>
        <p className="text-gray-700">Super easy headless forms</p>
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
          <h2 className="text-2xl font-medium">How it works</h2>
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
          <h2 className="text-2xl font-medium">Works everywhere</h2>
          <ul>
            <li className="mt-2 text-gray-700">React, Next.js, React Native</li>
            <li className="mt-2 text-gray-700">iOS, Android</li>
            <li className="mt-2 text-gray-700">Pretty much everywhere else!</li>
          </ul>
        </motion.div>
      </section>

      {!user && (
        <motion.section
          animate={{
            opacity: 1
          }}
          className="flex flex-col items-center mt-16"
          initial={{
            opacity: 0
          }}
          transition={{
            delay: 0.6,
            duration: 0.2
          }}>
          <GetStarted />
        </motion.section>
      )}
    </main>
  </>
)

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const user = await getUser(req)

  return {
    props: {
      user
    }
  }
}

export default Home
