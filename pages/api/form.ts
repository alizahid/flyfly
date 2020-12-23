import { NextApiRequest, NextApiResponse } from 'next'
import connect from 'next-connect'

import {
  createForm,
  deleteForm,
  getForms,
  getPlan,
  getUser,
  updateForm
} from '@flyfly/server'

const handler = connect<NextApiRequest, NextApiResponse>()
  .post(async (req, res) => {
    const user = await getUser(req)

    const forms = await getForms(user)

    const plan = await getPlan(user.planId)

    if (forms.length >= plan.forms) {
      return res.status(403).json({
        error: {
          body:
            'You have reached the form limit for your plan. Upgrade now to add more forms.',
          title: 'Plan limit reached'
        }
      })
    }

    const {
      body: { name, projectId }
    } = req

    const form = await createForm(user, projectId, name)

    res.json(form)
  })
  .put(async (req, res) => {
    const user = await getUser(req)

    const {
      body: { name },
      query: { formId }
    } = req

    const form = await updateForm(user, String(formId), name)

    res.json(form)
  })
  .delete(async (req, res) => {
    const user = await getUser(req)

    const {
      query: { formId }
    } = req

    await deleteForm(user, String(formId))

    res.json({
      status: 'ok'
    })
  })

export default handler
