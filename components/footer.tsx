import Link from 'next/link'
import React, { FunctionComponent } from 'react'

import { Icon } from '@flyfly/components'

export const Footer: FunctionComponent = () => {
  const links = [
    [
      {
        href: '/docs',
        label: 'Docs'
      },
      {
        href: '/pricing',
        label: 'Pricing'
      },
      {
        href: '/privacy',
        label: 'Privacy policy'
      }
    ],
    [
      {
        href: 'https://twitter.com/flyflydev',
        label: 'Twitter'
      },
      {
        href: 'https://github.com/flyflydev',
        label: 'GitHub'
      }
    ]
  ]

  return (
    <footer className="flex flex-col p-8 text-sm lg:flex-row">
      <div className="lg:mr-auto">
        <div className="text-gray-600">
          &copy; {new Date().getFullYear()} / FlyFly
        </div>
        <div className="text-gray-600 flex items-center mt-2">
          Built with
          <Icon
            className="mx-1"
            color="red"
            icon="heart"
            size={20}
            title="tremendous love"
          />
          in
          <span className="mx-1" title="Dubai, United Arab Emirates">
            DXB
          </span>
          and
          <span className="ml-1" title="Faisalabad, Pakistan">
            LYP
          </span>
        </div>
      </div>
      {links.map((links, index) => (
        <nav className="flex flex-col mt-4 lg:mt-0 lg:ml-8" key={index}>
          {links.map((link) => (
            <Link href={link.href} key={link.href}>
              <a className="text-gray-600 hover:text-gray-800 mt-2 first:mt-0">
                {link.label}
              </a>
            </Link>
          ))}
        </nav>
      ))}
    </footer>
  )
}
