import { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'

const Home: NextPage = () => (
  <>
    <Head>
      <title>FlyFly: Super easy headless forms</title>
    </Head>

    <main className="items-center justify-center text-center my-12">
      <img alt="FlyFly" className="w-40" src="/img/flyfly.svg" />
      <h1 className="text-4xl font-semibold mt-8">FlyFly</h1>
      <p className="text-gray-600">Super easy headless forms</p>

      <section className="flex flex-col lg:flex-row mt-20">
        <div className="flex-1">
          <h2 className="text-2xl font-medium">How it works</h2>
          <ul>
            <li className="mt-2 text-gray-700">
              Create a project and add a form
            </li>
            <li className="mt-2 text-gray-700">
              Use our JavaScript SDK or send a POST request from a library of
              your choice
            </li>
            <li className="mt-2 text-gray-700">Done!</li>
          </ul>
        </div>

        <div className="flex-1 mt-12 lg:mt-0 lg:ml-12">
          <h2 className="text-2xl font-medium">Works everywhere</h2>
          <ul>
            <li className="mt-2 text-gray-700">React, Next.js, React Native</li>
            <li className="mt-2 text-gray-700">Node.js, Express, Fastify</li>
            <li className="mt-2 text-gray-700">iOS, Android</li>
            <li className="mt-2 text-gray-700">Pretty much everywhere else!</li>
          </ul>
        </div>
      </section>
    </main>
  </>
)

export default Home
