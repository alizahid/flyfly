import update from 'immutability-helper'
import { useCallback } from 'react'
import { useMutation, useQuery } from 'react-query'

import { api, queryCache } from '@flyfly/lib'
import { Project } from '@flyfly/types'

// projects

type ProjectsReturns = {
  projects: Project[]
}

export const useProjects = (initialData: Project[]): ProjectsReturns => {
  const { data } = useQuery('projects', {
    initialData
  })

  return {
    projects: data
  }
}

// project

type ProjectReturns = {
  project: Project
}

export const useProject = (initialData: Project): ProjectReturns => {
  const { data } = useQuery(`project-${initialData.id}`, {
    initialData
  })

  return {
    project: data
  }
}

// create project

type CreateProjectReturns = {
  loading: boolean

  createProject: (name: string) => Promise<Project>
}

type CreateProjectVariables = {
  name: string
}

export const useCreateProject = (): CreateProjectReturns => {
  const [mutate, { isLoading }] = useMutation<
    Project,
    void,
    CreateProjectVariables
  >(
    ({ name }) =>
      api<Project>('/api/project', 'post', {
        name
      }),
    {
      onSuccess(response) {
        queryCache.setQueryData<Project[]>('projects', (projects) => [
          response,
          ...projects
        ])
      }
    }
  )

  const createProject = useCallback(
    (name) =>
      mutate({
        name
      }),
    []
  )

  return {
    createProject,
    loading: isLoading
  }
}

// update project

type UpdateProjectReturns = {
  loading: boolean

  updateProject: (projectId: string, name: string) => Promise<Project>
}

type UpdateProjectVariables = {
  name: string
  projectId: string
}

export const useUpdateProject = (): UpdateProjectReturns => {
  const [mutate, { isLoading }] = useMutation<
    Project,
    void,
    UpdateProjectVariables
  >(
    ({ name, projectId }) =>
      api<Project>(`/api/project?projectId=${projectId}`, 'put', {
        name
      }),
    {
      onSuccess(response, { name, projectId }) {
        queryCache.setQueryData<Project>(`project-${projectId}`, (data) =>
          update(data, {
            name: {
              $set: name
            }
          })
        )

        const exists = queryCache.getQueryData<Project[]>('projects')

        if (exists) {
          queryCache.setQueryData<Project[]>('projects', (projects) => {
            const index = projects.findIndex(({ id }) => id === projectId)

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
    }
  )

  const updateProject = useCallback(
    (projectId: string, name: string) =>
      mutate({
        name,
        projectId
      }),
    []
  )

  return {
    loading: isLoading,
    updateProject
  }
}

// delete project

type DeleteProjectReturns = {
  loading: boolean

  deleteProject: (id: string) => Promise<void>
}

type DeleteProjectVariables = {
  projectId: string
}

export const useDeleteProject = (): DeleteProjectReturns => {
  const [mutate, { isLoading }] = useMutation<
    void,
    void,
    DeleteProjectVariables
  >(({ projectId }) => api(`/api/project?projectId=${projectId}`, 'delete'), {
    onSuccess(response, { projectId }) {
      queryCache.setQueryData(`project-${projectId}`, null)

      const exists = queryCache.getQueryData<Project[]>('projects')

      if (exists) {
        queryCache.setQueryData<Project[]>('projects', (projects) => {
          const index = projects.findIndex(({ id }) => id === projectId)

          return update(projects, {
            $splice: [[index, 1]]
          })
        })
      }
    }
  })

  const deleteProject = useCallback(
    (projectId: string) =>
      mutate({
        projectId
      }),
    []
  )

  return {
    deleteProject,
    loading: isLoading
  }
}
