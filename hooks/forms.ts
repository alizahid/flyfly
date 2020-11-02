import { Form, Project } from '@prisma/client'
import update from 'immutability-helper'
import { useCallback } from 'react'
import { useMutation } from 'react-query'

import { api, queryCache } from '@flyfly/lib'
import { DashboardProject } from '@flyfly/types'

type CreateFormReturns = {
  loading: boolean

  createForm: (project: Project, name: string) => Promise<Form>
}

export const useCreateForm = (): CreateFormReturns => {
  const [mutate, { isLoading }] = useMutation<
    Form,
    void,
    {
      project: Project
      name: string
    }
  >(
    async ({ name, project: { slug } }) => {
      const form = await api.post<Form>('/api/create-form', {
        name,
        slug
      })

      return form
    },
    {
      onSuccess(form, { project: { slug } }) {
        queryCache.setQueryData<DashboardProject>(
          `project-${slug}`,
          (project) =>
            update(project, {
              forms: {
                $push: [form]
              }
            })
        )

        const exists = queryCache.getQueryData<DashboardProject[]>('projects')

        if (!exists) {
          return
        }

        queryCache.setQueryData<DashboardProject[]>('projects', (projects) => {
          const index = projects?.findIndex((project) => project.slug === slug)

          return update(projects, {
            [index]: {
              forms: {
                $push: [form]
              }
            }
          })
        })
      }
    }
  )

  const createForm = useCallback(
    (project: Project, name: string) =>
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
