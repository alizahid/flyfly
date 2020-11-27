import millify from 'millify'
import pluralize from 'pluralize'
import React, { FunctionComponent, useState } from 'react'

import { Icon } from '@flyfly/components'
import { Plan, User } from '@flyfly/types'

import { Plans } from './plans'

interface Props {
  className?: string
  plans: Plan[]
  profile: User
}

export const PlanCard: FunctionComponent<Props> = ({
  className,
  plans,
  profile: { planId }
}) => {
  const [visible, setVisible] = useState(false)

  const plan = plans.find(({ id }) => id === planId)

  return (
    <>
      <div
        className={`bg-white shadow-sm rounded-xl p-8 lg:p-4 flex flex-col lg:flex-row items-center ${className}`}>
        <div className="text-center lg:text-left mb-4 lg:mb-0 lg:mr-8">
          <div className="text-xl font-medium">{plan.name}</div>
          <div className="text-2xl font-medium mt-2">
            ${plan.price}
            <span className="text-gray-600 text-base font-normal">/month</span>
          </div>
          <div className="mt-2">
            {millify(plan.responses)} {pluralize('response', plan.responses)}
            <span className="text-gray-600">/month</span>
          </div>
          <div>{pluralize('form', plan.forms, true)}</div>
          <div>
            <span title="Unlimited">&#8734;</span> projects
          </div>
          <div>{plan.archive} day archive</div>
        </div>
        <Icon icon="createOutline" onClick={() => setVisible(true)} />
      </div>

      <Plans
        onClose={() => setVisible(false)}
        plans={plans}
        selected={planId}
        visible={visible}
      />
    </>
  )
}
