import { ServerClient } from 'postmark'

import { BatchMessage } from '@flyfly/types'

import { MongoForm, MongoProject } from './db/models'

const client = new ServerClient(process.env.POSTMARK_KEY)

export const sendEmail = async (
  email: string,
  project: MongoProject,
  form: MongoForm
): Promise<unknown> =>
  client.sendEmailWithTemplate({
    From: process.env.POSTMARK_EMAIL,
    TemplateAlias: 'response',
    TemplateModel: {
      form: form.name,
      project: project.name,
      url: `${process.env.URL}/projects/${project._id}/forms/${form._id}`
    },
    To: email
  })

export const sendBatchEmail = async (
  messages: BatchMessage[]
): Promise<unknown> =>
  client.sendEmailBatchWithTemplates(
    messages.map(({ data, email }) => ({
      From: process.env.POSTMARK_EMAIL,
      TemplateAlias: 'batch',
      TemplateModel: data,
      To: email
    }))
  )
