import Document, { Head, Html, Main, NextScript } from 'next/document'
import React from 'react'

class FlyFly extends Document {
  render(): JSX.Element {
    return (
      <Html>
        <Head />

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default FlyFly
