import dayjs from 'dayjs'
import { ObjectId } from 'mongodb'

import { sendEmail } from '@flyfly/server'
import { Response, User } from '@flyfly/types'

import { mongo } from '.'
import { MongoForm, MongoResponse, MongoUser } from './models'

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

  if (user.emailNotifications === 'immediate') {
    const project = await db.collection('projects').findOne({
      _id: form.projectId
    })

    await sendEmail(user.email, project, form)
  }

  return 'ok'
}

const parseResponse = ({ _id, createdAt, data }: MongoResponse): Response => ({
  createdAt: dayjs(createdAt).toISOString(),
  data,
  id: String(_id)
})

export const getResponses = async (
  user: User,
  formId: string,
  skip: number
): Promise<Response[]> => {
  const db = await mongo()

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

  return responses.map(parseResponse)
}
