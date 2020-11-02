import '../assets/global.scss'

import { Provider } from 'next-auth/client'
import App from 'next/app'
import React from 'react'
import { ReactQueryCacheProvider } from 'react-query'

import { Footer, Header } from '@flyfly/components'
import { queryCache } from '@flyfly/lib'

class FlyFly extends App {
  render(): JSX.Element {
    const { Component, pageProps } = this.props

    const { session } = pageProps

    return (
      <Provider session={session}>
        <ReactQueryCacheProvider queryCache={queryCache}>
          <Header />
          <Component {...pageProps} />
          <Footer />
        </ReactQueryCacheProvider>
      </Provider>
    )
  }
}

export default FlyFly
