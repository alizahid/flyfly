import '../assets/global.scss'

import { Provider } from 'next-auth/client'
import App from 'next/app'
import React from 'react'

import { Footer, Header } from '@flyfly/components'

class FlyFly extends App {
  render(): JSX.Element {
    const { Component, pageProps } = this.props

    const { session } = pageProps

    return (
      <Provider session={session}>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </Provider>
    )
  }
}

export default FlyFly
