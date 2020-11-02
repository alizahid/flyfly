import { motion } from 'framer-motion'
import { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'

const Home: NextPage = () => (
  <>
    <Head>
      <title>FlyFly: Super easy headless forms</title>
    </Head>

    <main className="landing justify-center text-center">
      <div className="relative py-24">
        <div
          className="bg-blue-200 h-full w-full absolute left-0 top-0"
          style={{
            clipPath: 'polygon(0 0, 100% 2em, 100% 100%, 0 calc(100% - 2em))',
            zIndex: -1
          }}
        />

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

        <section className="flex flex-col lg:flex-row justify-center w-full mt-12">
          <motion.div
            animate={{
              opacity: 1
            }}
            className="lg:w-1/4"
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
            className="lg:w-1/4 mt-12 lg:mt-0 lg:ml-12"
            initial={{
              opacity: 0
            }}
            transition={{
              delay: 0.4,
              duration: 0.2
            }}>
            <h2 className="text-2xl font-medium">Works everywhere</h2>
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
      </div>

      <div className="flex flex-col items-center relative mt-12 py-24">
        <div
          className="bg-blue-200 h-full w-full absolute left-0 top-0"
          style={{
            clipPath: 'polygon(0 2em, 100% 0, 100% 100%, 0 calc(100% - 2em))',
            zIndex: -1
          }}
        />

        <h2 className="text-3xl font-semibold">Cool heading</h2>

        <figure className="bg-white mx-8 lg:w-1/2 rounded-lg shadow-sm mt-12">
          <img className="rounded-lg" src="/img/screenshots/projects.png" />
          <figcaption className="m-4">Some cool copy</figcaption>
        </figure>

        <figure className="bg-white mx-8 lg:w-1/2 rounded-lg shadow-sm mt-12">
          <img className="rounded-lg" src="/img/screenshots/forms.png" />
          <figcaption className="m-4">Some cool copy</figcaption>
        </figure>
      </div>
    </main>
  </>
)

export default Home
