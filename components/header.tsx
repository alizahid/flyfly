import { signIn, signOut, useSession } from 'next-auth/client'
import { useRouter } from 'next/dist/client/router'
import Link, { LinkProps } from 'next/link'
import React, { FunctionComponent } from 'react'

import { Spinner } from './spinner'

export const Header: FunctionComponent = () => {
  const [session, loading] = useSession()

  return (
    <header className="flex flex-col m-12 lg:flex-row items-center lg:justify-between">
      <Link href="/">
        <a className="flex items-center">
          <img alt="FlyFly" className="h-8 w-8 mr-4" src="/img/flyfly.svg" />
          <span className="font-medium text-xl text-black">FlyFly</span>
        </a>
      </Link>
      {loading ? (
        <Spinner className="mt-8 lg:mt-0" />
      ) : (
        <nav className="flex items-center mt-8 lg:mt-0">
          {session && <NavLink href="/dashboard">Dashboard</NavLink>}
          <NavLink href="/pricing">Pricing</NavLink>
          <a
            className="flex items-center text-black leading-none font-medium"
            href="#signout"
            onClick={(event) => {
              event.preventDefault()

              if (session) {
                signOut()
              } else {
                signIn('github')
              }
            }}>
            {session ? (
              'Sign out'
            ) : (
              <>
                Sign in with{' '}
                <img className="h-6 w-6 ml-2" src="/img/github.svg" />
              </>
            )}
          </a>
        </nav>
      )}
    </header>
  )
}

const NavLink: FunctionComponent<LinkProps> = ({ children, href }) => {
  const { asPath } = useRouter()

  return (
    <Link href={href}>
      <a
        className={`hover:text-blue-500 leading-none font-medium mr-8 ${
          asPath === href ? 'text-blue-500' : 'text-black'
        }`}>
        {children}
      </a>
    </Link>
  )
}
