import update from 'immutability-helper'
import { useCallback } from 'react'
import { useMutation, useQuery } from 'react-query'

import { api, queryCache } from '@flyfly/lib'
import { User } from '@flyfly/types'

type ProfileReturns = {
  profile: User
}

export const useProfile = (initialData: User): ProfileReturns => {
  const { data } = useQuery('profile', {
    initialData
  })

  return {
    profile: data
  }
}

type UpdateNotificationsReturns = {
  loading: boolean

  updateNotifications: (user: Pick<User, 'emailNotifications'>) => Promise<User>
}

type UpdateNotificationsVariables = {
  user: Pick<User, 'emailNotifications'>
}

export const useUpdateNotifications = (): UpdateNotificationsReturns => {
  const [mutate, { isLoading }] = useMutation<
    User,
    void,
    UpdateNotificationsVariables
  >(({ user }) => api<User>(`/api/user`, 'put', user), {
    onSuccess(response, { user: { emailNotifications } }) {
      queryCache.setQueryData<User>('profile', (data) =>
        update(data, {
          emailNotifications: {
            $set: emailNotifications
          }
        })
      )
    }
  })

  const updateNotifications = useCallback(
    (user: Pick<User, 'emailNotifications'>) =>
      mutate({
        user
      }),
    []
  )

  return {
    loading: isLoading,
    updateNotifications
  }
}
