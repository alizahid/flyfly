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
