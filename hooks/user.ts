import update from 'immutability-helper'
import { useCallback } from 'react'
import { useMutation, useQuery } from 'react-query'

import { api, client } from '@flyfly/client'
import { User } from '@flyfly/types'

type SessionReturns = {
  loading: boolean
  user?: User
}

export const useSession = (): SessionReturns => {
  const { data, isLoading } = useQuery('session', () => api<User>('/api/user'))

  return {
    loading: isLoading,
    user: data
  }
}

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
  const { isLoading, mutateAsync } = useMutation<
    User,
    void,
    UpdateNotificationsVariables
  >(({ user }) => api<User>(`/api/user`, 'put', user), {
    onSuccess(response, { user: { emailNotifications } }) {
      client.setQueryData<User>('profile', (data) =>
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
      mutateAsync({
        user
      }),
    []
  )

  return {
    loading: isLoading,
    updateNotifications
  }
}
