import { useQuery } from 'react-query'

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
