import dayjs from 'dayjs'
import { ObjectId } from 'mongodb'

import { sendEmail } from '@flyfly/server'
import { Response, User } from '@flyfly/types'

import { mongo } from '.'
import { MongoForm, MongoResponse, MongoUser } from './models'
import { getPlan } from './plan'
import { getUsage } from './user'

export const submitForm = async (
  slug: string,
  data: Record<string, unknown>
): Promise<'ok' | 'error'> => {
  const db = await mongo()

  const form: MongoForm = await db.collection('forms').findOne({
    slug
  })

  if (!form) {
    return 'error'
  }

  const usage = await getUsage(String(form.userId))

  if (usage.used >= usage.total) {
    return 'error'
  }

  await db.collection('responses').insertOne({
    createdAt: new Date(),
    data,
    formId: form._id,
    projectId: form.projectId,
    userId: form.userId
  })

  const user: MongoUser = await db.collection('users').findOne({
    _id: form.userId
  })

  if (user.emailNotifications === 'immediately') {
    const project = await db.collection('projects').findOne({
      _id: form.projectId
    })

    await sendEmail(user.email, project, form)
  }

  return 'ok'
}

const parseResponse = (
  { _id, createdAt, data }: MongoResponse,
  archive: number
): Response => {
  const date = dayjs(createdAt)
  const difference = dayjs().diff(date, 'day')

  return {
    createdAt: date.toISOString(),
    data:
      difference > archive
        ? {
            'Archive limit reached': `You need to upgrade your plan to view responses older than ${archive} days.`
          }
        : data,
    id: String(_id)
  }
}

export const getResponses = async (
  user: User,
  formId: string,
  skip: number
): Promise<Response[]> => {
  const db = await mongo()

  const plan = await getPlan(user.planId)

  const responses = await db
    .collection('responses')
    .find({
      formId: new ObjectId(formId),
      userId: new ObjectId(user.id)
    })
    .sort({
      createdAt: -1
    })
    .limit(50)
    .skip(skip)
    .toArray()

  return responses.map((response) => parseResponse(response, plan.archive))
}

export const deleteResponse = async (
  user: User,
  responseId: string
): Promise<boolean> => {
  const db = await mongo()

  const _id = new ObjectId(responseId)

  const response: MongoResponse = await db.collection('responses').findOne({
    _id,
    userId: new ObjectId(user.id)
  })

  if (!response) {
    throw new Error('Response not found')
  }

  await db.collection('responses').deleteMany({
    _id
  })

  return true
}
