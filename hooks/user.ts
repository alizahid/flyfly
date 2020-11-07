import { User } from '@prisma/client'
import update from 'immutability-helper'
import { useCallback } from 'react'
import { useMutation, useQuery } from 'react-query'

import { api, queryCache } from '@flyfly/lib'

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

type UpdateProfileReturns = {
  loading: boolean

  updateProfile: (data: UpdateProfileVariables) => Promise<User>
}

type UpdateProfileVariables = {
  name: string
  email: string
}

export const useUpdateProfile = (): UpdateProfileReturns => {
  const [mutate, { isLoading }] = useMutation<
    User,
    void,
    UpdateProfileVariables
  >(
    async ({ email, name }) => {
      return api.post<User>('/api/update-profile', {
        email,
        name
      })
    },
    {
      onSuccess(user, { email, name }) {
        queryCache.setQueryData<User>('profile', (profile) =>
          update(profile, {
            email: {
              $set: email
            },
            emailVerified: {
              $set: user.emailVerified
            },
            name: {
              $set: name
            }
          })
        )
      }
    }
  )

  const updateProfile = useCallback(
    (data: UpdateProfileVariables) => mutate(data),
    []
  )

  return {
    loading: isLoading,
    updateProfile
  }
}
