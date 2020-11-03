import { Form, Project } from '@prisma/client'
import update from 'immutability-helper'
import { useCallback } from 'react'
import { useMutation, useQuery } from 'react-query'

import { api, queryCache } from '@flyfly/lib'
import {
  FormWithResponseCount,
  FormWithResponses,
  ProjectWithFormCount,
  ProjectWithFormsWithResponseCount
} from '@flyfly/types'

// form

type FormReturns = {
  form: FormWithResponses
  loading: boolean

  fetchMore: () => void
  refetch: () => void
}

export const useForm = (initialData: FormWithResponses): FormReturns => {
  const { data, fetchMore, isFetching, refetch } = useQuery(
    `form-${initialData.slug}`,
    {
      initialData
    }
  )

  return {
    fetchMore,
    form: data,
    loading: isFetching,
    refetch
  }
}

// create form

type CreateFormReturns = {
  loading: boolean

  createForm: (
    project: ProjectWithFormsWithResponseCount,
    name: string
  ) => Promise<FormWithResponseCount>
}

type CreateFormVariables = {
  name: string
  project: ProjectWithFormsWithResponseCount
}

export const useCreateForm = (): CreateFormReturns => {
  const [mutate, { isLoading }] = useMutation<
    FormWithResponseCount,
    void,
    CreateFormVariables
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

        if (exists) {
          queryCache.setQueryData<ProjectWithFormCount[]>(
            'projects',
            (projects) => {
              const index = projects.findIndex(
                (project) => project.slug === slug
              )

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

// update form

type UpdateFormReturns = {
  loading: boolean

  updateForm: (project: Project, form: Form, name: string) => Promise<Form>
}

type UpdateFormVariables = {
  form: Form
  name: string
  project: Project
}

export const useUpdateForm = (): UpdateFormReturns => {
  const [mutate, { isLoading }] = useMutation<Form, void, UpdateFormVariables>(
    async ({ form: { slug }, name }) => {
      const form = await api.post<Form>('/api/update-form', {
        name,
        slug
      })

      return form
    },
    {
      onSuccess(form, { form: { slug }, name, project }) {
        queryCache.setQueryData<FormWithResponses>(`form-${slug}`, (data) =>
          update(data, {
            name: {
              $set: name
            }
          })
        )

        const exists = queryCache.getQueryData(`project-${project.slug}`)

        if (exists) {
          queryCache.setQueryData<ProjectWithFormsWithResponseCount>(
            `project-${project.slug}`,
            (data) => {
              const index = data.forms.findIndex((form) => form.slug === slug)

              return update(data, {
                forms: {
                  [index]: {
                    name: {
                      $set: name
                    }
                  }
                }
              })
            }
          )
        }
      }
    }
  )

  const updateForm = useCallback(
    (project: Project, form: Form, name: string) =>
      mutate({
        form,
        name,
        project
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

  deleteForm: (project: Project, slug: string) => Promise<Form>
}

type DeleteFormVariables = {
  project: Project
  slug: string
}

export const useDeleteForm = (): DeleteFormReturns => {
  const [mutate, { isLoading }] = useMutation<Form, void, DeleteFormVariables>(
    async ({ slug }) => {
      const form = await api.post<Form>('/api/delete-form', {
        slug
      })

      return form
    },
    {
      onSuccess(response, { project, slug }) {
        queryCache.setQueryData<FormWithResponses>(`form-${slug}`, null)

        const exists = queryCache.getQueryData(`project-${project.slug}`)

        if (exists) {
          queryCache.setQueryData<ProjectWithFormsWithResponseCount>(
            `project-${project.slug}`,
            (data) => {
              const index = data.forms.findIndex((form) => form.slug === slug)

              return update(data, {
                forms: {
                  $splice: [[index, 1]]
                }
              })
            }
          )
        }
      }
    }
  )

  const deleteForm = useCallback(
    (project: Project, slug: string) =>
      mutate({
        project,
        slug
      }),
    []
  )

  return {
    deleteForm,
    loading: isLoading
  }
}
