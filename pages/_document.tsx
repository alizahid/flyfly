import Document, { Head, Html, Main, NextScript } from 'next/document'
import React from 'react'

class FlyFly extends Document {
  render(): JSX.Element {
    return (
      <Html>
        <Head />

        <body>
          <Main />
          <div id="modal"></div>

          <NextScript />
        </body>
      </Html>
    )
  }
}

export default FlyFly
