import dayjs from 'dayjs'
import { orderBy } from 'lodash'
import { ObjectId } from 'mongodb'
import { nanoid } from 'nanoid'

import { Form, User } from '@flyfly/types'

import { mongo } from '.'
import { MongoForm, MongoProject } from './models'

const parseForm = ({
  _id,
  name,
  projectId,
  responses,
  slug,
  updatedAt
}: MongoForm & {
  responses: number
}): Form => ({
  id: String(_id),
  name,
  projectId: String(projectId),
  responses: responses ?? 0,
  slug,
  updatedAt: dayjs(updatedAt).toISOString()
})

const slug = (): string => {
  const id = nanoid(6).toLowerCase()

  if (id.match(/([^a-z0-9]+)/)) {
    return slug()
  }

  return id
}

export const createForm = async (
  user: User,
  projectId: string,
  name: string
): Promise<Form> => {
  const db = await mongo()

  const { insertedId } = await db.collection('forms').insertOne({
    name,
    projectId: new ObjectId(projectId),
    slug: slug(),
    updatedAt: new Date(),
    userId: new ObjectId(user.id)
  })

  const form: MongoForm = await db.collection('forms').findOne({
    _id: insertedId
  })

  return parseForm({
    ...form,
    responses: 0
  })
}

export const getForms = async (
  user: User,
  projectId?: string
): Promise<Form[]> => {
  const db = await mongo()

  const query: Record<string, unknown> = {
    userId: new ObjectId(user.id)
  }

  if (projectId) {
    query.projectId = new ObjectId(projectId)
  }

  const forms = await db.collection('forms').find(query).toArray()

  const responses = await db
    .collection('responses')
    .aggregate([
      {
        $match: {
          formId: {
            $in: forms.map(({ _id }) => _id)
          }
        }
      },
      {
        $group: {
          _id: '$formId',
          count: {
            $sum: 1
          }
        }
      }
    ])
    .toArray()

  return orderBy(
    forms.map((form) =>
      parseForm({
        ...form,
        responses: responses.find(({ _id }) => _id.equals(form._id))?.count
      })
    ),
    'updatedAt',
    'desc'
  )
}

export const getForm = async (user: User, formId: string): Promise<Form> => {
  const db = await mongo()

  const form: MongoForm = await db.collection('forms').findOne({
    _id: new ObjectId(formId)
  })

  if (!form) {
    return null
  }

  const project: MongoProject = await db.collection('projects').findOne({
    _id: form.projectId,
    userId: new ObjectId(user.id)
  })

  if (!project) {
    return null
  }

  const responses = await db.collection('responses').countDocuments({
    formId: form._id
  })

  return parseForm({
    ...form,
    responses
  })
}

export const updateForm = async (
  user: User,
  formId: string,
  name: string
): Promise<Form> => {
  const db = await mongo()

  const form: MongoForm = await db.collection('forms').findOne({
    _id: new ObjectId(formId)
  })

  if (!form) {
    throw new Error('Form not found')
  }

  const project: MongoProject = await db.collection('projects').findOne({
    _id: form.projectId,
    userId: new ObjectId(user.id)
  })

  if (!project) {
    throw new Error('Form not found')
  }

  await db.collection('forms').updateOne(
    {
      _id: new ObjectId(formId)
    },
    {
      $set: {
        name,
        updatedAt: new Date()
      }
    }
  )

  return getForm(user, formId)
}

export const deleteForm = async (
  user: User,
  formId: string
): Promise<boolean> => {
  const db = await mongo()

  const form: MongoForm = await db.collection('forms').findOne({
    _id: new ObjectId(formId),
    userId: new ObjectId(user.id)
  })

  if (!form) {
    throw new Error('Form not found')
  }

  await db.collection('responses').deleteMany({
    formId: form._id
  })

  await db.collection('forms').deleteOne({
    _id: form._id
  })

  return true
}
