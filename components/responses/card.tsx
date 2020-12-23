import dayjs from 'dayjs'
import { AnimatePresence, motion } from 'framer-motion'
import React, { FunctionComponent, useState } from 'react'

import { parseValue } from '@flyfly/client'
import { Response } from '@flyfly/types'

import { Icon } from '../icon'

type Props = {
  className?: string
  response: Response
}

export const ResponseCard: FunctionComponent<Props> = ({
  className,
  response
}) => {
  const [expanded, setExpanded] = useState(false)

  const keys = Object.keys(response.data).length

  return (
    <article
      className={`bg-white shadow-sm rounded-lg ${className}`}
      key={response.id}>
      <header
        className="flex items-center text-gray-600 leading-none cursor-pointer p-4"
        onClick={() => setExpanded(!expanded)}>
        {dayjs(response.createdAt).format('hh:mm:ss [on] MMM D, YYYY')}
        <Icon
          className={`ml-auto lg:ml-4 transition-transform transform ${
            expanded ? '-rotate-180' : ''
          }`}
          color={expanded ? 'black' : 'gray'}
          icon="chevronDown"
          size={16}
        />
      </header>
      <AnimatePresence>
        {expanded && (
          <motion.div
            animate={{
              height: 'auto'
            }}
            className="overflow-hidden"
            exit={{
              height: 0
            }}
            initial={{
              height: 0
            }}
            transition={{
              duration: 0.2
            }}>
            <div
              className={`border-t border-gray-100 grid gap-4 p-4 ${
                keys >= 3 ? 'lg:grid-cols-3' : keys >= 2 ? 'lg:grid-cols-2' : ''
              }`}>
              {Object.entries(response.data).map(([key, value]) => (
                <div key={`${response.id}-data-${key}`}>
                  <div className="font-medium text-gray-600">{key}</div>
                  <Value value={value} />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  )
}

type ValueProps = {
  value: unknown
}

const Value: FunctionComponent<ValueProps> = ({ value }) => {
  const { data, mono } = parseValue(value)

  return <div className={mono ? 'font-code' : 'font-body'}>{data}</div>
}
