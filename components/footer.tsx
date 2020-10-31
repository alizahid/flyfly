import Link from 'next/link'
import React, { FunctionComponent } from 'react'

export const Footer: FunctionComponent = () => (
  <footer className="flex flex-col m-12 text-sm items-center lg:items-start lg:flex-row lg:justify-between">
    <p className="text-gray-600">&copy; {new Date().getFullYear()} / FlyFly</p>
    <nav className="flex flex-col items-center lg:items-start mt-4 lg:mt-0 lg:ml-8">
      <Link href="/privacy">
        <a className="text-gray-600 hover:text-gray-800">Privacy policy</a>
      </Link>
      <Link href="/pricing">
        <a className="text-gray-600 hover:text-gray-800 mt-2">Pricing</a>
      </Link>
      <a
        className="text-gray-600 hover:text-gray-800 mt-2"
        href="https://github.com/alizahid/flyfly">
        GitHub
      </a>
    </nav>
  </footer>
)
