import '../assets/global.scss'

import { AppProps } from 'next/app'
import Progress from 'nextjs-progressbar'
import React, { FunctionComponent } from 'react'
import { ReactQueryCacheProvider } from 'react-query'

import { Footer, Header } from '@flyfly/components'
import { queryCache } from '@flyfly/lib'

const FlyFly: FunctionComponent<AppProps> = ({ Component, pageProps }) => (
  <ReactQueryCacheProvider queryCache={queryCache}>
    <Progress color="#059669" />
    <Header user={pageProps.user} />
    <Component {...pageProps} />
    <Footer />
  </ReactQueryCacheProvider>
)

export default FlyFly
