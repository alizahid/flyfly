import React, { FunctionComponent } from 'react'

import { Spinner } from './spinner'

export const Loading: FunctionComponent = () => (
  <main className="my-12 items-center justify-center">
    <Spinner />
  </main>
)
