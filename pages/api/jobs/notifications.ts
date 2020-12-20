import dayjs from 'dayjs'
import { upperFirst } from 'lodash'
import { NextApiHandler } from 'next'
import { MongoProject, MongoUser } from 'server/db/models'

import { mongo, sendBatchEmail } from '@flyfly/server'
import { BatchMessage } from '@flyfly/types'

const handler: NextApiHandler = async (req, res) => {
  const { query } = req

  const interval = String(query.interval) as 'daily' | 'weekly'
  const secret = String(query.secret)

  if (secret !== process.env.JOB_SECRET) {
    res.json({
      message: 'Invalid secret',
      status: 'error'
    })

    return
  }

  if (!['daily', 'weekly'].includes(interval)) {
    res.json({
      message: 'Invalid interval',
      status: 'error'
    })

    return
  }

  const db = await mongo()

  const users: MongoUser[] = await db
    .collection('users')
    .find({
      emailNotifications: interval
    })
    .toArray()

  if (users.length === 0) {
    res.json({
      status: 'ok'
    })

    return
  }

  const data = await db
    .collection('responses')
    .aggregate([
      {
        $match: {
          createdAt: {
            $gte: dayjs()
              .subtract(interval === 'daily' ? 1 : 7, 'day')
              .toDate()
          },
          userId: {
            $in: users.map(({ _id }) => _id)
          }
        }
      },
      {
        $group: {
          _id: {
            formId: '$formId',
            projectId: '$projectId',
            userId: '$userId'
          },
          total: {
            $sum: 1
          }
        }
      },
      {
        $group: {
          _id: '$_id.projectId',
          forms: {
            $push: {
              count: '$total',
              formId: '$_id.formId'
            }
          },
          userId: {
            $last: '$_id.userId'
          }
        }
      }
    ])
    .toArray()

  const projects: MongoProject[] = await db
    .collection('projects')
    .find({
      _id: {
        $in: data.map(({ _id }) => _id)
      }
    })
    .toArray()

  const forms: MongoProject[] = await db
    .collection('forms')
    .find({
      _id: {
        $in: data.map(({ forms }) => forms.map(({ formId }) => formId)).flat()
      }
    })
    .toArray()

  const messages: BatchMessage[] = users.map((user) => {
    return {
      data: {
        projects: data
          .filter(({ userId }) => userId.equals(user._id))
          .map((data) => {
            const project = projects.find(({ _id }) => _id.equals(data._id))

            return {
              forms: data.forms.map((data) => {
                const form = forms.find(({ _id }) => _id.equals(data.formId))

                return {
                  form: form.name,
                  responses: data.count
                }
              }),
              project: project.name
            }
          }),
        title: `${upperFirst(interval)} digest`
      },
      email: user.email
    }
  })

  await sendBatchEmail(messages)

  res.json({
    status: 'ok'
  })
}

export default handler
