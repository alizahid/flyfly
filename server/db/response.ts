import dayjs from 'dayjs'
import { ObjectId } from 'mongodb'

import { Response, User } from '@flyfly/types'

import { mongo } from '.'
import { MongoForm, MongoResponse } from './models'

export const submitForm = async (
  formId: string,
  data: Record<string, unknown>
): Promise<'ok' | 'error'> => {
  const db = await mongo()

  const form: MongoForm = await db.collection('forms').findOne({
    _id: new ObjectId(formId)
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
    .limit(100)
    .skip(skip)
    .toArray()

  return responses.map(parseResponse)
}
