import '../assets/global.scss'

import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { AppProps } from 'next/app'
import Progress from 'nextjs-progressbar'
import React, { FunctionComponent } from 'react'
import { ReactQueryCacheProvider } from 'react-query'

import { Footer, Header } from '@flyfly/components'
import { queryCache } from '@flyfly/lib'

dayjs.extend(localizedFormat)

const FlyFly: FunctionComponent<AppProps> = ({ Component, pageProps }) => (
  <ReactQueryCacheProvider queryCache={queryCache}>
    <Progress
      color="#059669"
      height={4}
      options={{
        template: '<div class="bar" role="bar"></div>'
      }}
    />
    <Header />
    <Component {...pageProps} />
    <Footer />
  </ReactQueryCacheProvider>
)

export default FlyFly
