import React, {
  FunctionComponent,
  ReactNode,
  useEffect,
  useRef,
  useState
} from 'react'

import { Icon } from './icon'

type CommonProps = {
  message: string
  title: string
  visible: boolean

  onClose: () => void
}

type AlertProps = {
  buttonLabel?: string
  type: 'alert'
}

type ConfirmProps = {
  destructive: 'yes' | 'no'
  type: 'confirm'

  onResponse: (response: boolean) => void
}

type PromptProps = {
  placeholder: string
  type: 'prompt'

  onSubmit: (value: string) => void
}

type Props = CommonProps & (AlertProps | ConfirmProps | PromptProps)

export const Modal: FunctionComponent<Props> = ({
  message,
  onClose,
  title,
  type,
  visible,
  ...props
}) => {
  if (!visible) {
    return null
  }

  const valueRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState('')

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keyup', handler)

    return () => {
      document.removeEventListener('keyup', handler)
    }
  }, [])

  let inner: ReactNode = null

  if (type === 'alert') {
    const { buttonLabel } = props as AlertProps

    inner = (
      <div className="mt-4 border-t border-gray-100">
        <button
          className="p-4 font-medium text-blue-500 w-full"
          onClick={() => onClose()}>
          {buttonLabel ?? 'Okay'}
        </button>
      </div>
    )
  }

  if (type === 'confirm') {
    const { destructive = 'yes', onResponse } = props as ConfirmProps

    inner = (
      <div className="flex justify-between mt-4 border-t border-gray-100">
        <button
          className={`flex-1 p-4 font-medium ${
            destructive === 'no' ? 'text-red-500' : 'text-blue-500'
          }`}
          onClick={() => {
            onResponse(false)
            onClose()
          }}>
          No
        </button>
        <button
          className={`flex-1 p-4 font-medium border-l border-gray-100 ${
            destructive === 'yes' ? 'text-red-500' : 'text-blue-500'
          }`}
          onClick={() => {
            onResponse(true)
            onClose()
          }}>
          Yes
        </button>
      </div>
    )
  }

  if (type === 'prompt') {
    const { onSubmit, placeholder } = props as PromptProps

    const submit = () => {
      if (!value) {
        valueRef.current.focus()

        return
      }

      onSubmit(value)
      onClose()
    }

    inner = (
      <>
        <div className="mt-4 mx-4">
          <input
            autoFocus
            className="appearance-none bg-gray-100 rounded-lg w-full p-4"
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                submit()
              }
            }}
            placeholder={placeholder}
            ref={valueRef}
            type="text"
            value={value}
          />
        </div>
        <div className="flex justify-between mt-4 border-t border-gray-100">
          <button
            className="flex-1 p-4 font-medium text-red-500"
            onClick={() => onClose()}>
            Cancel
          </button>
          <button
            className="flex-1 p-4 border-l border-gray-100 font-medium text-green-500"
            onClick={submit}>
            Submit
          </button>
        </div>
      </>
    )
  }

  return (
    <div
      className="flex items-center justify-center fixed bg-modal top-0 right-0 bottom-0 left-0"
      onClick={(event) => {
        if (event.currentTarget === event.target) {
          onClose()
        }
      }}>
      <div className="bg-white rounded-lg w-full max-w-modal shadow-sm m-8">
        <header className="flex items-stretch justify-between">
          <h4 className="font-medium text-xl m-4">{title}</h4>
          <a
            className="flex items-center p-4"
            href="#close"
            onClick={(event) => {
              event.preventDefault()

              onClose()
            }}>
            <Icon icon="close" />
          </a>
        </header>
        <p className="text-gray-700 mx-4">{message}</p>
        {inner}
      </div>
    </div>
  )
}
