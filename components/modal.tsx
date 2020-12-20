import { AnimatePresence, motion } from 'framer-motion'
import React, {
  FunctionComponent,
  ReactNode,
  useEffect,
  useRef,
  useState
} from 'react'

import { Icon } from './icon'
import { Spinner } from './spinner'

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
  loading?: boolean
  type: 'confirm'

  onNo?: () => void
  onYes: () => Promise<unknown> | void
}

type PromptProps = {
  loading?: boolean
  placeholder: string
  type: 'prompt'
  value?: string

  onSubmit: (value: string) => Promise<unknown> | void
}

type CustomProps = {
  type: 'custom'
}

type Props = CommonProps &
  (AlertProps | ConfirmProps | PromptProps | CustomProps)

export const Modal: FunctionComponent<Props> = ({
  children,
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
      <footer className="border-t border-gray-100">
        <button
          className="p-4 font-medium text-emerald-500 w-full"
          onClick={() => onClose()}>
          {buttonLabel ?? 'Okay'}
        </button>
      </footer>
    )
  }

  if (type === 'confirm') {
    const { destructive = 'yes', loading, onNo, onYes } = props as ConfirmProps

    inner = (
      <footer className="flex justify-between border-t border-gray-100">
        <button
          className={`flex-1 p-4 font-medium ${
            destructive === 'no' ? 'text-red-500' : 'text-emerald-500'
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
            destructive === 'yes' ? 'text-red-500' : 'text-emerald-500'
          }`}
          onClick={async () => {
            await onYes()

            onClose()
            setValue('')
          }}>
          {loading ? <Spinner className="mx-auto" /> : 'Yes'}
        </button>
      </footer>
    )
  }

  if (type === 'prompt') {
    const { loading, onSubmit, placeholder } = props as PromptProps

    const submit = async () => {
      if (!value) {
        valueRef.current.focus()

        return
      }

      await onSubmit(value)

      onClose()

      if (!(props as PromptProps).value) {
        setValue('')
      }
    }

    inner = (
      <>
        <div className="mx-4">
          <input
            autoFocus
            className="appearance-none transition-colors bg-gray-50 focus:bg-gray-100 rounded-lg w-full p-4"
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
        <footer className="flex mt-4 border-t border-gray-100">
          <button
            className="flex-1 p-4 font-medium text-red-500"
            onClick={() => onClose()}>
            Cancel
          </button>
          <button
            className="flex-1 p-4 font-medium text-emerald-500"
            disabled={loading}
            onClick={submit}>
            {loading ? <Spinner className="mx-auto" /> : 'Submit'}
          </button>
        </footer>
      </>
    )
  }

  if (type === 'custom') {
    inner = children
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          animate={{
            opacity: 1
          }}
          className="flex items-center justify-center fixed bg-modal top-0 right-0 bottom-0 left-0 z-30"
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
          <div className="bg-white rounded-xl w-full max-w-modal max-h-screen overflow-y-auto shadow m-8">
            <header className="flex items-stretch justify-between border-b border-gray-100">
              <h4 className="flex-1 font-semibold text-lg m-4">{title}</h4>
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
            {message.length > 0 && (
              <div className="text-gray-700 m-4">{message}</div>
            )}
            {inner}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
