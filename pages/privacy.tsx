import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

const Privacy: NextPage = () => (
  <>
    <Head>
      <title>Privacy policy / FlyFly</title>
    </Head>

    <main className="bg-white rounded-xl shadow-sm py-8">
      <h1 className="text-4xl font-semibold">Privacy policy</h1>
      <p className="text-sm text-gray-700 mt-2">
        Last updated on December 26, 2020
      </p>

      <h2 className="text-2xl font-semibold mt-16">
        Data collection and usage
      </h2>
      <p className="mt-2">
        We collect the follow data about you to provide you with the service;
      </p>
      <ul className="list-disc ml-8 mt-2">
        <li>Your name</li>
        <li className="mt-2">Your email address</li>
        <li className="mt-2">Your GitHub avatar</li>
      </ul>
      <h3 className="text-xl font-semibold mt-8">Your name</h3>
      <p className="mt-2">
        Your name is only visible to yourself. Nobody else can see it.
      </p>
      <h3 className="text-xl font-semibold mt-8">Your email address</h3>
      <p className="mt-2">
        Your email address is only visible to yourself. Nobody else can see it.
        We use your email to send your notifications about new responses to your
        forms.
      </p>
      <h3 className="text-xl font-semibold mt-8">Your GitHub avatar</h3>
      <p className="mt-2">
        Your GitHub avatar is only visible to yourself. Nobody else can see it.
      </p>

      <p className="mt-8 font-medium">
        We care about your privacy and will never share your personal details
        with anyone else.
      </p>

      <h2 className="text-2xl font-semibold mt-16">
        Data storage and transport
      </h2>
      <p className="mt-2">We store all your data in an encrypted database.</p>
      <p className="mt-2">
        We use SSL for all communication so nobody can see what you do on our
        website.
      </p>

      <h2 className="text-2xl font-semibold mt-16">Cookies</h2>
      <p className="mt-2">
        We use one secure cookie for your session. Other than that, we use no
        cookies on our website.
      </p>

      <p className="mt-16">
        FlyFly is open-source. You can view the code on{' '}
        <Link href="https://github.com/flyflydev">
          <a>GitHub</a>
        </Link>
        .
      </p>
    </main>
  </>
)

export default Privacy
