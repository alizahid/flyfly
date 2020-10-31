import { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'

interface Props {
  code: number
}

const Error: NextPage<Props> = ({ code }) => (
  <>
    <Head>
      <title>{code || 'Error'} / FlyFly</title>
    </Head>

    <main className="items-center justify-center text-center my-12">
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
      <h1 className="text-5xl font-bold my-8">{code || 'Error'}</h1>
      {code === 404 ? (
        <>
          <p>Looks what what you were looking for has flown away.</p>
          <p className="mt-2">We have dispatched butterfly collectors.</p>
        </>
      ) : (
        <p>You killed the butterfly! Fear not, we have dispatched medics.</p>
      )}
    </main>
  </>
)

Error.getInitialProps = async ({ err }) => {
  const code = err?.statusCode ?? 404

  return {
    code
  }
}

export default Error
