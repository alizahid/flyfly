import React from 'react'
import ReactDOM from 'react-dom'

import { Modal } from '@flyfly/components'

class Dialog {
  alert(title: string, message: string) {
    const modal = document.querySelector('#modal')

    ReactDOM.render(
      <Modal
        message={message}
        onClose={() => ReactDOM.unmountComponentAtNode(modal)}
        title={title}
        type="alert"
        visible
      />,
      modal
    )
  }
}

export const dialog = new Dialog()
