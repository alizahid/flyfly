import { Project } from '@prisma/client'
import update from 'immutability-helper'
import { useCallback } from 'react'
import { useMutation, useQuery } from 'react-query'

import { api, queryCache } from '@flyfly/lib'
import { DashboardProject } from '@flyfly/types'

type ProjectsReturns = {
  data: DashboardProject[]
}

export const useProjects = (
  initialData: DashboardProject[]
): ProjectsReturns => {
  const { data } = useQuery('projects', {
    initialData
  })

  return {
    data
  }
}

type ProjectReturns = {
  data: DashboardProject
}

export const useProject = (initialData: DashboardProject): ProjectReturns => {
  const { data } = useQuery(`project-${initialData.slug}`, {
    initialData
  })

  return {
    data
  }
}

type CreateProjectReturns = {
  loading: boolean

  createProject: (name: string) => Promise<DashboardProject>
}

export const useCreateProject = (): CreateProjectReturns => {
  const [mutate, { isLoading }] = useMutation<DashboardProject, void, string>(
    async (name) => {
      const project = await api.post<DashboardProject>('/api/create-project', {
        name
      })

      return project
    },
    {
      onSuccess(project) {
        queryCache.setQueryData<DashboardProject[]>('projects', (projects) => [
          ...projects,
          project
        ])
      }
    }
  )

  const createProject = useCallback((name) => mutate(name), [])

  return {
    createProject,
    loading: isLoading
  }
}

type UpdateProjectReturns = {
  loading: boolean

  updateProject: (project: Project, name: string) => Promise<DashboardProject>
}

export const useUpdateProject = (): UpdateProjectReturns => {
  const [mutate, { isLoading }] = useMutation<
    DashboardProject,
    void,
    {
      project: Project
      name: string
    }
  >(
    async ({ name, project: { slug } }) => {
      const project = await api.post<DashboardProject>('/api/update-project', {
        name,
        slug
      })

      return project
    },
    {
      onSuccess(project, { name, project: { slug } }) {
        queryCache.setQueryData<DashboardProject>(
          `project-${project.slug}`,
          (data) =>
            update(data, {
              name: {
                $set: name
              }
            })
        )

        const exists = queryCache.getQueryData<DashboardProject[]>('projects')

        if (!exists) {
          return
        }

        queryCache.setQueryData<DashboardProject[]>('projects', (projects) => {
          const index = projects.findIndex((project) => project.slug === slug)

          return update(projects, {
            [index]: {
              name: {
                $set: name
              }
            }
          })
        })
      }
    }
  )

  const updateProject = useCallback(
    (project, name) =>
      mutate({
        name,
        project
      }),
    []
  )

  return {
    loading: isLoading,
    updateProject
  }
}

type DeleteProjectReturns = {
  loading: boolean

  deleteProject: (slug: string) => Promise<void>
}

export const useDeleteProject = (): DeleteProjectReturns => {
  const [mutate, { isLoading }] = useMutation<void, void, string>(
    async (slug) => {
      await api.post<DashboardProject>('/api/delete-project', {
        slug
      })
    },
    {
      onSuccess(response, slug) {
        queryCache.setQueryData(`project-${slug}`, null)

        const exists = queryCache.getQueryData<DashboardProject[]>('projects')

        if (!exists) {
          return
        }

        queryCache.setQueryData<DashboardProject[]>('projects', (projects) => {
          const index = projects.findIndex((project) => project.slug === slug)

          return update(projects, {
            $splice: [[index, 1]]
          })
        })
      }
    }
  )

  const deleteProject = useCallback((slug: string) => mutate(slug), [])

  return {
    deleteProject,
    loading: isLoading
  }
}
