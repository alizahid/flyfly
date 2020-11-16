import { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'

import { User } from '@flyfly/types'

interface Props {
  code: number
  user?: User
}

const Error: NextPage<Props> = ({ code }) => (
  <>
    <Head>
      <title>{code === 404 ? 'Not found' : 'Error'} / FlyFly</title>
    </Head>

    <main className="fly-one justify-center items-center text-center">
      <img
        alt="FlyFly"
        className="w-40"
        src="/img/flyfly.svg"
        style={
          code === 404
            ? undefined
            : {
                filter:
                  'grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) contrast(0.8)'
              }
        }
      />
      <h1 className="text-5xl font-bold mt-8">
        {code === 404 ? 'Not found' : 'Error'}
      </h1>
      {code === 404 ? (
        <>
          <p className="mt-2">
            Looks what what you were looking for has flown away.
          </p>
          <p className="mt-2">We have dispatched butterfly collectors.</p>
        </>
      ) : (
        <>
          <p className="mt-2">You killed the butterfly!</p>
          <p className="mt-2">Fear not, we have dispatched medics.</p>
        </>
      )}
    </main>
  </>
)

export default Error
