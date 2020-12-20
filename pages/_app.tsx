import '../styles/tailwind.scss'
import '../styles/global.scss'

import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { AppProps } from 'next/app'
import Progress from 'nextjs-progressbar'
import React, { FunctionComponent } from 'react'
import { QueryClientProvider } from 'react-query'

import { client } from '@flyfly/client'
import { Footer, Header } from '@flyfly/components'

dayjs.extend(localizedFormat)

const FlyFly: FunctionComponent<AppProps> = ({ Component, pageProps }) => (
  <QueryClientProvider client={client}>
    <Progress
      color="#059669"
      height={4}
      options={{
        template: '<div class="bar" role="bar" />'
      }}
    />
    <Header />
    <Component {...pageProps} />
    <Footer />
  </QueryClientProvider>
)

export default FlyFly
