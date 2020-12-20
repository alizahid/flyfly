import dayjs from 'dayjs'
import React, { FunctionComponent } from 'react'

import { Plan, Usage, User } from '@flyfly/types'

type Props = {
  className?: string
  profile: User
  plans: Plan[]
  usage: Usage
}

export const UsageCard: FunctionComponent<Props> = ({
  className,
  plans,
  profile,
  usage
}) => {
  const plan = plans.find(({ id }) => id === profile.planId)

  return (
    <div className={`bg-white shadow-sm rounded-xl p-8 lg:p-4 ${className}`}>
      <div className="flex flex-col lg:flex-row items-center">
        <span className="text-xl font-medium">
          {usage.count} of {plan.responses}
        </span>
        <span className="lg:ml-2">responses used</span>
      </div>
      <div className="text-sm text-gray-500 text-center lg:text-left mt-4 lg:mt-2">
        Resets on {dayjs(usage.endsAt).format('LL')}
      </div>
    </div>
  )
}
