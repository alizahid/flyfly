import { NextPage } from 'next'
import Head from 'next/head'
import React, { useState } from 'react'

import { Code } from '@flyfly/components'

const Docs: NextPage = () => {
  const [language, setLanguage] = useState('js')

  const languages = [
    {
      code: 'js',
      name: 'JavaScript'
    },
    {
      code: 'python',
      name: 'Python'
    },
    {
      code: 'ruby',
      name: 'Ruby'
    },
    {
      code: 'php',
      name: 'PHP'
    }
  ]

  const code = {
    js: `fetch('https://flyfly.dev/f/xxx', {
  body: JSON.stringify({
    email: 'hi@flyfly.dev',
    name: 'Ali Zahid',
    newCustomer: false,
    rating: {
      service: 5,
      design: 5
    }
  }),
  headers: {
    'content-type': 'application/json'
  },
  method: 'post'
})`,
    php: `$ch = curl_init('https://flyfly.dev/f/xxx');

curl_setopt($ch, CURLOPT_HTTPHEADER, array('content-type: application/json'));
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(array(
  'email' => 'hi@flyfly.dev',
  'name' => 'Ali Zahid',
  'newCustomer' => false,
  'rating' => array(
    'service' => 5,
    'design' => 5
  )
)));

curl_exec($ch);
curl_close($ch);`,
    python: `import requests

requests.post(
  'https://flyfly.dev/f/xxx',
  json={
    'email': 'hi@flyfly.dev',
    'name': 'Ali Zahid',
    'newCustomer': False,
    'rating': {
      'service': 5,
      'design': 5
    }
  }
)`,
    ruby: `require 'json'
require 'net/http'
require 'uri'

Net::HTTP.post(
  URI('https://flyfly.dev/f/xxx'),
  {
    email: 'hi@flyfly.dev',
    name: 'Ali Zahid',
    newCustomer: false,
    rating: {
      design: 5,
      service: 5
    }
  }.to_json,
  'content-type' => 'application/json'
)`
  }

  return (
    <main className="bg-white rounded-xl shadow-sm py-8">
      <Head>
        <title>Docs / FlyFly</title>
      </Head>

      <h1 className="text-4xl font-semibold">Docs</h1>

      <h2 className="font-semibold text-2xl my-8">Code examples</h2>

      <section className="bg-gray-900 rounded-lg">
        <aside className="flex overflow-x-auto">
          {languages.map(({ code, name }) => (
            <button
              className={`p-4 ${
                code === language
                  ? 'text-emerald-400 font-semibold'
                  : 'text-white'
              }`}
              key={code}
              onClick={() => setLanguage(code)}>
              {name}
            </button>
          ))}
        </aside>
        <Code code={code[language]} language={language} />
      </section>

      <p className="mt-8">More examples coming soon!</p>

      <h2 className="text-2xl font-semibold mt-16">Limits</h2>

      <ul className="mt-4">
        <li>FlyFly form responses cannot exceed 100kb in size.</li>
      </ul>
    </main>
  )
}

export default Docs
