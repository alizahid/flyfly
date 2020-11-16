import React, { FunctionComponent } from 'react'

import { Spinner } from './spinner'

export const Loading: FunctionComponent = () => (
  <main className="flex items-center justify-center">
    <Spinner />
  </main>
)
