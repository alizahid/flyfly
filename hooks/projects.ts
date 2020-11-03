import { Project } from '@prisma/client'
import update from 'immutability-helper'
import { useCallback } from 'react'
import { useMutation, useQuery } from 'react-query'

import { api, queryCache } from '@flyfly/lib'
import {
  ProjectWithFormCount,
  ProjectWithFormsWithResponseCount
} from '@flyfly/types'

// projects

type ProjectsReturns = {
  projects: ProjectWithFormCount[]
}

export const useProjects = (
  initialData: ProjectWithFormCount[]
): ProjectsReturns => {
  const { data } = useQuery('projects', {
    initialData
  })

  return {
    projects: data
  }
}

// project

type ProjectReturns = {
  project: ProjectWithFormsWithResponseCount
}

export const useProject = (
  initialData: ProjectWithFormsWithResponseCount
): ProjectReturns => {
  const { data } = useQuery(`project-${initialData.slug}`, {
    initialData
  })

  return {
    project: data
  }
}

// create project

type CreateProjectReturns = {
  loading: boolean

  createProject: (name: string) => Promise<ProjectWithFormCount>
}

export const useCreateProject = (): CreateProjectReturns => {
  const [mutate, { isLoading }] = useMutation<
    ProjectWithFormCount,
    void,
    string
  >(
    async (name) => {
      const project = await api.post<ProjectWithFormCount>(
        '/api/create-project',
        {
          name
        }
      )

      return project
    },
    {
      onSuccess(project) {
        queryCache.setQueryData<ProjectWithFormCount[]>(
          'projects',
          (projects) => [...projects, project]
        )
      }
    }
  )

  const createProject = useCallback((name) => mutate(name), [])

  return {
    createProject,
    loading: isLoading
  }
}

// update project

type UpdateProjectReturns = {
  loading: boolean

  updateProject: (project: Project, name: string) => Promise<Project>
}

export const useUpdateProject = (): UpdateProjectReturns => {
  const [mutate, { isLoading }] = useMutation<
    Project,
    void,
    {
      project: Project
      name: string
    }
  >(
    async ({ name, project: { slug } }) => {
      const project = await api.post<Project>('/api/update-project', {
        name,
        slug
      })

      return project
    },
    {
      onSuccess(project, { name, project: { slug } }) {
        queryCache.setQueryData<ProjectWithFormCount>(
          `project-${project.slug}`,
          (data) =>
            update(data, {
              name: {
                $set: name
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
                  name: {
                    $set: name
                  }
                }
              })
            }
          )
        }
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

// delete project

type DeleteProjectReturns = {
  loading: boolean

  deleteProject: (slug: string) => Promise<void>
}

export const useDeleteProject = (): DeleteProjectReturns => {
  const [mutate, { isLoading }] = useMutation<void, void, string>(
    async (slug) => {
      await api.post<ProjectWithFormCount>('/api/delete-project', {
        slug
      })
    },
    {
      onSuccess(response, slug) {
        queryCache.setQueryData(`project-${slug}`, null)

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
                $splice: [[index, 1]]
              })
            }
          )
        }
      }
    }
  )

  const deleteProject = useCallback((slug: string) => mutate(slug), [])

  return {
    deleteProject,
    loading: isLoading
  }
}
