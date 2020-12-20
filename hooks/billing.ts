import { loadStripe } from '@stripe/stripe-js'
import dayjs from 'dayjs'
import update from 'immutability-helper'
import { useCallback } from 'react'
import { useMutation } from 'react-query'

import { api, client, dialog } from '@flyfly/client'
import { User } from '@flyfly/types'

type CancelPlanReturns = {
  loading: boolean

  cancelPlan: () => Promise<CancelPlanResponse>
}

type CancelPlanResponse = {
  cancelAt: string
}

export const useCancelPlan = (): CancelPlanReturns => {
  const { isLoading, mutateAsync } = useMutation<CancelPlanResponse, void>(
    () => api('/api/stripe/cancel'),
    {
      onSuccess({ cancelAt }) {
        dialog.alert(
          'Subscription canceled',
          `Your FlyFly subscription has been canceled and you will be reverted to the free plan on ${dayjs(
            cancelAt
          ).format('LL')}.`
        )
      }
    }
  )

  const cancelPlan = useCallback(() => mutateAsync(), [])

  return {
    cancelPlan,
    loading: isLoading
  }
}

type ChangePlanReturns = {
  loading: boolean

  changePlan: (priceId: string) => Promise<ChangePlanResponse>
}

type ChangePlanVariables = {
  priceId: string
}

type ChangePlanResponse = {
  sessionId?: string
  planId?: string
}

export const useChangePlan = (): ChangePlanReturns => {
  const { isLoading, mutateAsync } = useMutation<
    ChangePlanResponse,
    void,
    ChangePlanVariables
  >(
    async ({ priceId }) =>
      api<ChangePlanResponse>(`/api/stripe/change`, 'post', {
        priceId
      }),
    {
      async onSuccess({ planId, sessionId }) {
        if (planId) {
          client.setQueryData<User>('profile', (data) =>
            update(data, {
              planId: {
                $set: planId
              }
            })
          )
        }

        if (sessionId) {
          const stripe = await loadStripe(process.env.STRIPE_KEY)

          await stripe.redirectToCheckout({
            sessionId
          })
        }
      }
    }
  )

  const changePlan = useCallback(
    (priceId: string) =>
      mutateAsync({
        priceId
      }),
    []
  )

  return {
    changePlan,
    loading: isLoading
  }
}
