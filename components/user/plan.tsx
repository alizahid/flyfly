import millify from 'millify'
import pluralize from 'pluralize'
import React, { FunctionComponent } from 'react'

import { Icon } from '@flyfly/components'
import { User } from '@flyfly/types'

interface Props {
  className?: string
  profile: User
}

export const PlanCard: FunctionComponent<Props> = ({
  className,
  profile: { plan }
}) => (
  <div
    className={`bg-white shadow-sm rounded-xl p-8 lg:p-4 flex flex-col lg:flex-row items-center ${className}`}>
    <div className="text-center lg:text-left mb-4 lg:mb-0 lg:mr-8">
      <div className="text-xl font-medium">{plan.name}</div>
      <div className="text-2xl font-medium">
        ${plan.price}
        <span className="text-gray-600 text-base font-normal">/month</span>
      </div>
      <div className="mt-4">
        {millify(plan.responses)} {pluralize('response', plan.responses)}
        <span className="text-gray-600">/month</span>
      </div>
      <div>{pluralize('form', plan.forms, true)}</div>
      <div>
        <span title="Unlimited">&#8734;</span> projects
      </div>
      <div>{plan.archive} day archive</div>
    </div>
    <div>
      <Icon icon="createOutline" />
    </div>
  </div>
)
