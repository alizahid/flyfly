import dayjs from 'dayjs'
import { orderBy } from 'lodash'
import { ObjectId } from 'mongodb'

import { Project, User } from '@flyfly/types'

import { mongo } from '.'
import { MongoProject } from './models'

const parseProject = ({
  _id,
  forms,
  name,
  responses,
  updatedAt
}: MongoProject & {
  forms: number
  responses: number
}): Project => ({
  forms: forms ?? 0,
  id: String(_id),
  name,
  responses: responses ?? 0,
  updatedAt: dayjs(updatedAt).toISOString()
})

export const createProject = async (
  user: User,
  name: string
): Promise<Project> => {
  const db = await mongo()

  const { insertedId } = await db.collection('projects').insertOne({
    name,
    updatedAt: new Date(),
    userId: new ObjectId(user.id)
  })

  const project: MongoProject = await db.collection('projects').findOne({
    _id: insertedId
  })

  return parseProject({
    ...project,
    forms: 0,
    responses: 0
  })
}

export const getProjects = async (user: User): Promise<Project[]> => {
  const db = await mongo()

  const projects: MongoProject[] = await db
    .collection('projects')
    .find({
      userId: new ObjectId(user.id)
    })
    .toArray()

  const ids = projects.map(({ _id }) => _id)

  const forms = await db
    .collection('forms')
    .aggregate([
      {
        $match: {
          projectId: {
            $in: ids
          }
        }
      },
      {
        $group: {
          _id: '$projectId',
          count: {
            $sum: 1
          }
        }
      }
    ])
    .toArray()

  const responses = await db
    .collection('responses')
    .aggregate([
      {
        $match: {
          projectId: {
            $in: ids
          }
        }
      },
      {
        $group: {
          _id: '$projectId',
          count: {
            $sum: 1
          }
        }
      }
    ])
    .toArray()

  return orderBy(
    projects.map((project) =>
      parseProject({
        ...project,
        forms: forms.find(({ _id }) => _id.equals(project._id))?.count,
        responses: responses.find(({ _id }) => _id.equals(project._id))?.count
      })
    ),
    'updatedAt',
    'desc'
  )
}

export const getProject = async (user: User, id: string): Promise<Project> => {
  const db = await mongo()

  const project: MongoProject = await db.collection('projects').findOne({
    _id: new ObjectId(id),
    userId: new ObjectId(user.id)
  })

  if (!project) {
    return null
  }

  const forms = await db.collection('forms').countDocuments({
    projectId: project._id
  })

  const responses = await db.collection('responses').countDocuments({
    projectId: project._id
  })

  return parseProject({
    ...project,
    forms,
    responses
  })
}

export const updateProject = async (
  user: User,
  projectId: string,
  name: string
): Promise<Project> => {
  const db = await mongo()

  const project: MongoProject = await db.collection('projects').findOne({
    _id: new ObjectId(projectId),
    userId: new ObjectId(user.id)
  })

  if (!project) {
    throw new Error('Project not found')
  }

  await db.collection('projects').updateOne(
    {
      _id: project._id
    },
    {
      $set: {
        name,
        updatedAt: new Date()
      }
    }
  )

  return getProject(user, projectId)
}

export const deleteProject = async (
  user: User,
  projectId: string
): Promise<boolean> => {
  const db = await mongo()

  const project: MongoProject = await db.collection('projects').findOne({
    _id: new ObjectId(projectId),
    userId: new ObjectId(user.id)
  })

  if (!project) {
    throw new Error('Project not found')
  }

  await db.collection('responses').deleteMany({
    projectId: project._id
  })

  await db.collection('forms').deleteMany({
    projectId: project._id
  })

  await db.collection('projects').deleteOne({
    _id: project._id
  })

  return true
}
