import Link from 'next/link'
import React, { FunctionComponent } from 'react'

export const Footer: FunctionComponent = () => (
  <footer className="flex flex-col m-8 text-sm items-center lg:items-start lg:flex-row lg:justify-between">
    <p className="text-gray-600">&copy; {new Date().getFullYear()} / FlyFly</p>
    <nav className="flex flex-col items-center lg:items-start mt-4 lg:mt-0 lg:ml-8">
      <Link href="/docs">
        <a className="text-gray-600">Docs</a>
      </Link>
      <Link href="/pricing">
        <a className="text-gray-600 mt-2">Pricing</a>
      </Link>
      <Link href="/privacy">
        <a className="text-gray-600 mt-2">Privacy policy</a>
      </Link>
      <a
        className="text-gray-600 mt-2"
        href="https://github.com/alizahid/flyfly">
        GitHub
      </a>
    </nav>
  </footer>
)
