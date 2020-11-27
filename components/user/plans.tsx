import { Spinner } from 'components/spinner'
import millify from 'millify'
import pluralize from 'pluralize'
import React, { FunctionComponent, useState } from 'react'

import { Modal } from '@flyfly/components'
import { useCancelPlan, useChangePlan } from '@flyfly/hooks'
import { Plan } from '@flyfly/types'

interface Props {
  plans: Plan[]
  selected: string
  visible: boolean

  onClose: () => void
}

export const Plans: FunctionComponent<Props> = ({
  onClose,
  plans,
  selected,
  visible
}) => {
  const [planId, setPlanId] = useState(selected)
  const [priceId, setPriceId] = useState<string>()

  const { cancelPlan, loading: canceling } = useCancelPlan()
  const { changePlan, loading: changing } = useChangePlan()

  return (
    <Modal
      message=""
      onClose={() => onClose()}
      title="Change plan"
      type="custom"
      visible={visible}>
      {plans.map((plan) => (
        <div
          className={`rounded-lg cursor-pointer p-4 m-4 ${
            plan.id === planId ? 'bg-emerald-100' : 'bg-gray-100'
          }`}
          key={plan.id}
          onClick={() => {
            setPlanId(plan.id)
            setPriceId(plan.stripeId)
          }}>
          <header className="flex justify-between font-display">
            <div className="text-xl font-medium">{plan.name}</div>
            <div className="text-2xl font-medium">
              ${plan.price}
              <span className="text-base font-normal text-gray-700">
                /month
              </span>
            </div>
          </header>
          <div className="grid lg:grid-cols-2 gap-2 mt-4">
            <div>
              {millify(plan.responses)} {pluralize('response', plan.responses)}
              <span className="text-gray-600">/m</span>
            </div>
            <div>{pluralize('form', plan.forms, true)}</div>
            <div>
              <span title="Unlimited">&#8734;</span> projects
            </div>
            <div>{plan.archive} day archive</div>
          </div>
        </div>
      ))}
      <footer className="flex justify-between border-t border-gray-100">
        <button
          className="flex-1 p-4 font-medium text-gray-500"
          onClick={() => onClose()}>
          Cancel
        </button>
        <button
          className={`flex-1 p-4 font-medium ${
            planId === selected ? 'text-gray-500' : 'text-emerald-500'
          }`}
          disabled={canceling || changing || planId === selected}
          onClick={async () => {
            if (planId === process.env.FREE_PLAN_ID) {
              await cancelPlan()
            } else if (priceId) {
              await changePlan(priceId)
            }

            onClose()
          }}>
          {canceling || changing ? (
            <Spinner className="mx-auto" />
          ) : (
            `${planId === process.env.FREE_PLAN_ID ? 'Cancel' : 'Change'} plan`
          )}
        </button>
      </footer>
    </Modal>
  )
}
