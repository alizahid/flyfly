import { AnimatePresence, motion } from 'framer-motion'
import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import React, { FunctionComponent, useEffect, useState } from 'react'

import { User } from '@flyfly/types'

import { Icon } from './icon'

interface Props {
  user?: User
}

export const Header: FunctionComponent<Props> = ({ user }) => {
  const { asPath } = useRouter()

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(false)
  }, [asPath])

  const links = [
    {
      label: 'Docs',
      link: '/docs'
    }
  ]

  if (user) {
    links.unshift(
      ...[
        {
          label: 'Projects',
          link: '/projects'
        },
        {
          label: 'Account',
          link: '/account'
        }
      ]
    )

    links.push({
      label: 'Sign out',
      link: '/api/auth/sign-out'
    })
  } else {
    links.unshift({
      label: 'Pricing',
      link: '/pricing'
    })
  }

  const nav = (
    <>
      {links.map(({ label, link }) => (
        <NavLink href={link} key={label}>
          {label}
        </NavLink>
      ))}
      {!user && (
        <a
          className="flex items-center justify-center text-black hover:text-emerald-600 p-8 lg:p-0 w-full lg:w-auto lg:ml-8"
          href="/api/auth/sign-in">
          Sign in with <Icon className="ml-2" icon="logoGithub" />
        </a>
      )}
    </>
  )

  return (
    <header className="flex flex-row items-center justify-between leading-none relative">
      <Link href="/">
        <a className="flex items-center p-8">
          <img alt="FlyFly" className="h-8 w-8 mr-4" src="/img/flyfly.svg" />
          <span className="font-medium text-xl text-black">FlyFly</span>
        </a>
      </Link>
      <a
        className="lg:hidden flex items-center justify-center absolute right-0 top-0 h-24 w-24 z-20"
        href="#menu"
        onClick={(event) => {
          event.preventDefault()

          setVisible(!visible)
        }}>
        <Icon icon={visible ? 'close' : 'menu'} />
      </a>
      <AnimatePresence>
        {visible && (
          <motion.nav
            animate={{
              opacity: 1
            }}
            className="flex items-center justify-center flex-col text-2xl lg:hidden fixed bg-overlay top-0 right-0 bottom-0 left-0 z-10"
            exit={{
              opacity: 0
            }}
            initial={{
              opacity: 0
            }}
            transition={{
              duration: 0.1
            }}>
            {nav}
          </motion.nav>
        )}
      </AnimatePresence>
      <nav className="hidden lg:flex lg:items-center mx-8">{nav}</nav>
    </header>
  )
}

const NavLink: FunctionComponent<LinkProps> = ({ children, href }) => {
  const { asPath } = useRouter()

  return (
    <Link href={href} passHref>
      <a
        className={`hover:text-emerald-600 p-8 lg:p-0 w-full lg:w-auto lg:ml-8 first:ml-0 text-center ${
          asPath.indexOf(href.toString()) === 0
            ? 'text-emerald-600'
            : 'text-black'
        }`}>
        {children}
      </a>
    </Link>
  )
}
