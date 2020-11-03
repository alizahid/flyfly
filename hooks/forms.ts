import update from 'immutability-helper'
import { useCallback } from 'react'
import { useMutation } from 'react-query'

import { api, queryCache } from '@flyfly/lib'
import {
  FormWithResponseCount,
  ProjectWithFormCount,
  ProjectWithFormsWithResponseCount
} from '@flyfly/types'

type CreateFormReturns = {
  loading: boolean

  createForm: (
    project: ProjectWithFormsWithResponseCount,
    name: string
  ) => Promise<FormWithResponseCount>
}

export const useCreateForm = (): CreateFormReturns => {
  const [mutate, { isLoading }] = useMutation<
    FormWithResponseCount,
    void,
    {
      project: ProjectWithFormsWithResponseCount
      name: string
    }
  >(
    async ({ name, project: { slug } }) => {
      const form = await api.post<FormWithResponseCount>('/api/create-form', {
        name,
        slug
      })

      return form
    },
    {
      onSuccess(form, { project: { forms, slug } }) {
        queryCache.setQueryData<ProjectWithFormsWithResponseCount>(
          `project-${slug}`,
          (project) =>
            update(project, {
              forms: {
                $push: [form]
              }
            })
        )

        const exists = queryCache.getQueryData<ProjectWithFormCount[]>(
          'projects'
        )

        if (!exists) {
          return
        }

        queryCache.setQueryData<ProjectWithFormCount[]>(
          'projects',
          (projects) => {
            const index = projects.findIndex((project) => project.slug === slug)

            return update(projects, {
              [index]: {
                forms: {
                  $set: forms.length + 1
                }
              }
            })
          }
        )
      }
    }
  )

  const createForm = useCallback(
    (project: ProjectWithFormsWithResponseCount, name: string) =>
      mutate({
        name,
        project
      }),
    []
  )

  return {
    createForm,
    loading: isLoading
  }
}
