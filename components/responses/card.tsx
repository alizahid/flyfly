import { Response } from '@prisma/client'
import dayjs from 'dayjs'
import { AnimatePresence, motion } from 'framer-motion'
import React, { FunctionComponent, useState } from 'react'

import { parseValue } from '@flyfly/lib'

import { Icon } from '../icon'

interface Props {
  className?: string
  response: Response
}

export const ResponseCard: FunctionComponent<Props> = ({
  className,
  response
}) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <article
      className={`bg-white shadow-sm rounded-lg ${className}`}
      key={response.id}>
      <header
        className="flex items-center text-gray-600 leading-none cursor-pointer p-4"
        onClick={() => setExpanded(!expanded)}>
        {dayjs(response.createdAt).format('hh:mm:ss [on] MMM D, YYYY')}
        <Icon
          className="ml-auto lg:ml-4"
          color={expanded ? 'black' : 'gray'}
          icon={expanded ? 'chevronUp' : 'chevronDown'}
          size={16}
        />
      </header>
      <AnimatePresence>
        {expanded && (
          <motion.div
            animate={{
              height: 'auto'
            }}
            className="border-t border-gray-200 grid lg:grid-cols-4 gap-4 p-4"
            exit={{
              height: 0
            }}
            initial={{
              height: 0
            }}
            transition={{
              duration: 0.2
            }}>
            {Object.entries(response.data).map(([key, value]) => (
              <div key={`${response.id}-data-${key}`}>
                <div className="text-gray-600">{key}</div>
                <Value value={value} />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  )
}

interface ValueProps {
  value: unknown
}

const Value: FunctionComponent<ValueProps> = ({ value }) => {
  const { data, mono } = parseValue(value)

  return <div className={mono ? 'font-sans' : 'font-sans'}>{data}</div>
}
