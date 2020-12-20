import Link from 'next/link'
import React, { FunctionComponent } from 'react'

export const Footer: FunctionComponent = () => (
  <footer className="flex flex-col p-8 text-sm lg:flex-row">
    <p className="text-gray-600">&copy; {new Date().getFullYear()} / FlyFly</p>
    <nav className="flex flex-col mt-4 lg:mt-0 lg:ml-auto">
      <Link href="/docs">
        <a className="text-gray-600">Docs</a>
      </Link>
      <Link href="/pricing">
        <a className="text-gray-600 mt-2">Pricing</a>
      </Link>
      <Link href="/help">
        <a className="text-gray-600 mt-2">Help</a>
      </Link>
    </nav>
    <nav className="flex flex-col mt-4 lg:mt-0 lg:ml-8">
      <Link href="/privacy">
        <a className="text-gray-600">Privacy policy</a>
      </Link>
      <a
        className="text-gray-600 mt-2"
        href="https://github.com/alizahid/flyfly">
        GitHub
      </a>
    </nav>
  </footer>
)
