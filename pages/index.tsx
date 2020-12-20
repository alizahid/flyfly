import { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import React from 'react'

import { GetStarted, Spinner } from '@flyfly/components'
import { useSession } from '@flyfly/hooks'

const Home: NextPage = () => {
  const { loading, user } = useSession()

  return (
    <main className="bg-white rounded-xl shadow-sm py-16 justify-center text-center lg:text-left">
      <Head>
        <title>FlyFly: Super easy headless forms</title>
      </Head>

      <header className="flex flex-col items-center justify-center lg:flex-row">
        <Image
          alt="FlyFly"
          className="m-auto"
          height={100}
          src="/img/flyfly.svg"
          width={100}
        />
        <div className="mt-8 lg:mt-0 lg:ml-8">
          <h1 className="text-4xl font-semibold">FlyFly</h1>
          <div className="text-gray-700 mt-2">Super easy headless forms</div>
        </div>
      </header>

      <section>
        <div className="flex flex-col lg:flex-row items-center justify-center mt-16">
          <div className="flex-1 lg:flex lg:justify-end">
            <Image
              alt="How it works"
              height={300}
              src="/img/hero/home_one.svg"
              width={300}
            />
          </div>
          <div className="flex-1 lg:ml-8">
            <h2 className="text-2xl font-semibold">How it works</h2>
            <ul className="mt-2 text-gray-700">
              <li>Create a project and add a form</li>
              <li>Send a POST request to our API</li>
              <li>Done!</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row-reverse items-center justify-center">
          <div className="flex-1 lg:ml-8">
            <Image
              alt="Use everywhere"
              height={300}
              src="/img/hero/home_two.svg"
              width={300}
            />
          </div>
          <div className="flex-1 lg:text-right">
            <h2 className="text-2xl font-semibold">Use everywhere</h2>
            <ul className="mt-2 text-gray-700">
              <li>React, Next.js, React Native</li>
              <li>iOS, Android</li>
              <li>Anywhere else, really</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center">
          <div className="flex-1 lg:flex lg:justify-end">
            <Image
              alt="Integrations"
              height={300}
              src="/img/hero/home_three.svg"
              width={300}
            />
          </div>
          <div className="flex-1 lg:ml-8">
            <h2 className="text-2xl font-semibold">Integrations</h2>
            <ul className="mt-2 text-gray-700">
              <li>Coming soon!</li>
            </ul>
          </div>
        </div>
      </section>

      {loading ? (
        <Spinner className="mx-auto mt-16" />
      ) : user ? null : (
        <section className="flex flex-col items-center mt-16">
          <GetStarted />
        </section>
      )}
    </main>
  )
}

export default Home
