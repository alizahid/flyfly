import dayjs from 'dayjs'
import React, { FunctionComponent } from 'react'

import { Usage } from '@flyfly/types'

type Props = {
  className?: string
  usage: Usage
}

export const UsageCard: FunctionComponent<Props> = ({ className, usage }) => {
  const percent = (usage.used / usage.total) * 100

  return (
    <div className={`bg-white shadow-sm rounded-xl p-8 lg:p-4 ${className}`}>
      <div className="flex flex-col lg:flex-row items-center">
        <span
          className={`text-xl font-medium ${
            percent > 80
              ? 'text-red-500'
              : percent > 50
              ? 'text-amber-500'
              : 'text-green-500'
          }`}>
          {usage.used} of {usage.total}
        </span>
        <span className="lg:ml-2">responses used</span>
      </div>
      <div className="text-sm text-gray-500 text-center lg:text-left mt-4 lg:mt-2">
        Resets on {dayjs(usage.endsAt).format('LL')}
      </div>
    </div>
  )
}
