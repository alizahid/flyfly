import update from 'immutability-helper'
import { useCallback, useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-query'

import { api, client } from '@flyfly/client'
import { Form, Project, Response } from '@flyfly/types'

// forms

type FormsReturns = {
  forms: Form[]
}

export const useForms = (
  projectId: string,
  initialData: Form[]
): FormsReturns => {
  const { data } = useQuery(`forms-${projectId}`, {
    initialData
  })

  return {
    forms: data
  }
}

// form

type FormReturns = {
  form: Form
}

export const useForm = (initialData: Form): FormReturns => {
  const { data } = useQuery(`form-${initialData.id}`, {
    initialData
  })

  return {
    form: data
  }
}

// responses

type ResponsesReturns = {
  loading: boolean
  responses: Response[]

  fetchMore: () => void
  refetch: () => void
}

export const useResponses = (
  formId: string,
  initial: Response[]
): ResponsesReturns => {
  const [responses, setResponses] = useState<Response[]>(initial)
  const [loading, setLoading] = useState(false)
  const [skip, setSkip] = useState(0)

  useEffect(() => {
    setSkip(responses.length)
  }, [responses.length])

  const fetch = async (formId: string, skip: number) => {
    setLoading(true)

    const next = await api<Response[]>(
      `/api/responses?formId=${formId}&skip=${skip}`
    )

    setLoading(false)

    return next
  }

  const refetch = useCallback(async () => {
    const responses = await fetch(formId, 0)

    setResponses(responses)
  }, [])

  const fetchMore = useCallback(async () => {
    const next = await fetch(formId, skip)

    setResponses([...responses, ...next])
  }, [skip])

  return {
    fetchMore,
    loading,
    refetch,
    responses
  }
}

// create form

type CreateFormReturns = {
  loading: boolean

  createForm: (projectId: string, name: string) => Promise<Form>
}

type CreateFormVariables = {
  name: string
  projectId: string
}

export const useCreateForm = (): CreateFormReturns => {
  const { isLoading, mutateAsync } = useMutation<
    Form,
    void,
    CreateFormVariables
  >(
    async ({ name, projectId }) =>
      api<Form>('/api/form', 'post', {
        name,
        projectId
      }),
    {
      onSuccess(response, { projectId }) {
        client.setQueryData<Form[]>(`forms-${projectId}`, (project) =>
          update(project, {
            $unshift: [response]
          })
        )

        const projects = client.getQueryData<Project[]>('projects')

        if (projects) {
          client.setQueryData<Project[]>('projects', (projects) => {
            const forms = client.getQueryData<Form[]>(`forms-${projectId}`)
              .length

            const index = projects.findIndex(
              (project) => project.id === projectId
            )

            return update(projects, {
              [index]: {
                forms: {
                  $set: forms
                }
              }
            })
          })
        }
      }
    }
  )

  const createForm = useCallback(
    (projectId: string, name: string) =>
      mutateAsync({
        name,
        projectId
      }),
    []
  )

  return {
    createForm,
    loading: isLoading
  }
}

// update form

type UpdateFormReturns = {
  loading: boolean

  updateForm: (projectId: string, formId: string, name: string) => Promise<Form>
}

type UpdateFormVariables = {
  formId: string
  name: string
  projectId: string
}

export const useUpdateForm = (): UpdateFormReturns => {
  const { isLoading, mutateAsync } = useMutation<
    Form,
    void,
    UpdateFormVariables
  >(
    ({ formId, name }) =>
      api<Form>(`/api/form?formId=${formId}`, 'put', {
        name
      }),
    {
      onSuccess(response, { formId, name, projectId }) {
        client.setQueryData<Form>(`form-${formId}`, (data) =>
          update(data, {
            name: {
              $set: name
            }
          })
        )

        const forms = client.getQueryData(`forms-${projectId}`)

        if (forms) {
          client.setQueryData<Form[]>(`forms-${projectId}`, (forms) => {
            const index = forms.findIndex(({ id }) => id === formId)

            return update(forms, {
              [index]: {
                name: {
                  $set: name
                }
              }
            })
          })
        }
      }
    }
  )

  const updateForm = useCallback(
    (projectId: string, formId: string, name: string) =>
      mutateAsync({
        formId,
        name,
        projectId
      }),
    []
  )

  return {
    loading: isLoading,
    updateForm
  }
}

// delete form

type DeleteFormReturns = {
  loading: boolean

  deleteForm: (projectId: string, formId: string) => Promise<Form>
}

type DeleteFormVariables = {
  formId: string
  projectId: string
}

export const useDeleteForm = (): DeleteFormReturns => {
  const { isLoading, mutateAsync } = useMutation<
    Form,
    void,
    DeleteFormVariables
  >(({ formId }) => api<Form>(`/api/form?formId=${formId}`, 'delete'), {
    onSuccess(response, { formId, projectId }) {
      client.setQueryData<Form>(`form-${formId}`, null)

      const forms = client.getQueryData(`forms-${projectId}`)

      if (forms) {
        client.setQueryData<Form[]>(`forms-${projectId}`, (forms) => {
          const index = forms.findIndex(({ id }) => id === formId)

          return update(forms, {
            $splice: [[index, 1]]
          })
        })
      }

      const projects = client.getQueryData(`project-${projectId}`)

      if (projects) {
        client.setQueryData<Project[]>('projects', (projects) => {
          const index = projects.findIndex(({ id }) => id === projectId)

          return update(projects, {
            [index]: {
              forms: {
                $set: projects[index].forms - 1
              }
            }
          })
        })
      }
    }
  })

  const deleteForm = useCallback(
    (projectId: string, formId: string) =>
      mutateAsync({
        formId,
        projectId
      }),
    []
  )

  return {
    deleteForm,
    loading: isLoading
  }
}
