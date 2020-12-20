import { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import React from 'react'

type Props = {
  code: number
}

const Error: NextPage<Props> = ({ code }) => (
  <>
    <Head>
      <title>{code === 404 ? 'Not found' : 'Error'} / FlyFly</title>
    </Head>

    <main className="bg-white rounded-xl shadow-sm py-16 justify-center items-center text-center">
      <Image
        alt="FlyFly"
        className={code >= 500 ? 'hard-error' : ''}
        height={160}
        src="/img/flyfly.svg"
        width={160}
      />
      <h1 className="text-5xl font-bold mt-8">
        {code === 404 ? 'Not found' : 'Error'}
      </h1>
      {code === 404 ? (
        <>
          <p className="mt-4">
            Looks what what you were looking for has flown away.
          </p>
          <p className="mt-2">We have dispatched butterfly collectors.</p>
        </>
      ) : (
        <>
          <p className="mt-4">You killed the butterfly!</p>
          <p className="mt-2">Fear not, we have dispatched medics.</p>
        </>
      )}
    </main>
  </>
)

export default Error
