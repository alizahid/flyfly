import { AnimatePresence, motion } from 'framer-motion'
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
  destructive?: 'yes' | 'no'
  type: 'confirm'

  onNo?: () => void
  onYes: () => void
}

type PromptProps = {
  placeholder: string
  type: 'prompt'
  value?: string

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
  const valueRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState((props as PromptProps).value ?? '')

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
      <footer className="border-t border-gray-200">
        <button
          className="p-4 font-medium text-blue-500 w-full"
          onClick={() => onClose()}>
          {buttonLabel ?? 'Okay'}
        </button>
      </footer>
    )
  }

  if (type === 'confirm') {
    const { destructive = 'yes', onNo, onYes } = props as ConfirmProps

    inner = (
      <footer className="flex justify-between border-t border-gray-200">
        <button
          className={`flex-1 p-4 font-medium ${
            destructive === 'no' ? 'text-red-500' : 'text-blue-500'
          }`}
          onClick={() => {
            onNo?.()
            onClose()
            setValue('')
          }}>
          No
        </button>
        <button
          className={`flex-1 p-4 font-medium ${
            destructive === 'yes' ? 'text-red-500' : 'text-blue-500'
          }`}
          onClick={() => {
            onYes()
            onClose()
            setValue('')
          }}>
          Yes
        </button>
      </footer>
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
        <div className="mx-4">
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
        <footer className="flex mt-4 border-t border-gray-200">
          <button
            className="flex-1 p-4 font-medium text-red-500"
            onClick={() => onClose()}>
            Cancel
          </button>
          <button
            className="flex-1 p-4 font-medium text-green-500"
            onClick={submit}>
            Submit
          </button>
        </footer>
      </>
    )
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          animate={{
            opacity: 1
          }}
          className="flex items-center justify-center fixed bg-modal top-0 right-0 bottom-0 left-0"
          exit={{
            opacity: 0
          }}
          initial={{
            opacity: 0
          }}
          onClick={(event) => {
            if (event.currentTarget === event.target) {
              onClose()
            }
          }}
          transition={{
            duration: 0.1
          }}>
          <div className="bg-white rounded-lg w-full max-w-modal shadow-sm m-8">
            <header className="flex items-stretch justify-between border-b border-gray-200">
              <h4 className="flex-1 font-medium text-xl m-4">{title}</h4>
              <a
                className="flex items-center px-4"
                href="#close"
                onClick={(event) => {
                  event.preventDefault()

                  onClose()
                }}>
                <Icon icon="close" />
              </a>
            </header>
            <p className="text-gray-700 m-4">{message}</p>
            {inner}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
