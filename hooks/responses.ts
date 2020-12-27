import update from 'immutability-helper'
import { uniqBy } from 'lodash'
import { useCallback, useState } from 'react'
import { useMutation, useQuery } from 'react-query'

import { api, client } from '@flyfly/client'
import { Response } from '@flyfly/types'

// responses

type ResponsesReturns = {
  fetching: boolean
  loading: boolean
  responses: Response[]

  fetchMore: () => void
  refetch: () => void
}

export const useResponses = (
  formId: string,
  initial: Response[]
): ResponsesReturns => {
  const { data } = useQuery<Response[]>(`responses-${formId}`, {
    initialData: initial
  })

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)

  const fetch = async (formId: string, skip: number) => {
    if (skip === 0) {
      setLoading(true)
    } else {
      setFetching(true)
    }

    const next = await api<Response[]>(
      `/api/response?formId=${formId}&skip=${skip}`
    )

    if (skip === 0) {
      setLoading(false)
    } else {
      setFetching(false)
    }

    return next
  }

  const refetch = useCallback(async () => {
    const responses = await fetch(formId, 0)

    client.setQueryData(`responses-${formId}`, responses)
  }, [])

  const fetchMore = useCallback(async () => {
    const fetched = await fetch(formId, data.length)

    const next = uniqBy([...data, ...fetched], 'id')

    client.setQueryData(`responses-${formId}`, next)
  }, [])

  return {
    fetchMore,
    fetching,
    loading,
    refetch,
    responses: data
  }
}

// delete response

type DeleteResponseReturns = {
  loading: boolean

  deleteResponse: (formId: string, responseId: string) => Promise<unknown>
}

type DeleteResponseVariables = {
  formId: string
  responseId: string
}

export const useDeleteResponse = (): DeleteResponseReturns => {
  const { isLoading, mutateAsync } = useMutation<
    void,
    void,
    DeleteResponseVariables
  >(
    ({ responseId }) => api(`/api/response?responseId=${responseId}`, 'delete'),
    {
      onSuccess(response, { formId, responseId }) {
        const responses = client.getQueryData<Response[]>(`responses-${formId}`)

        if (responses) {
          client.setQueryData<Response[]>(
            `responses-${formId}`,
            (responses) => {
              const index = responses.findIndex(({ id }) => id === responseId)

              return update(responses, {
                $splice: [[index, 1]]
              })
            }
          )
        }
      }
    }
  )

  const deleteResponse = useCallback(
    (formId: string, responseId: string) =>
      mutateAsync({
        formId,
        responseId
      }),
    []
  )

  return {
    deleteResponse,
    loading: isLoading
  }
}
