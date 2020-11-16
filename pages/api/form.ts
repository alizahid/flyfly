import { NextApiRequest, NextApiResponse } from 'next'
import connect from 'next-connect'

import { createForm, deleteForm, getUser, updateForm } from '@flyfly/server'

const handler = connect<NextApiRequest, NextApiResponse>()
  .post(async (req, res) => {
    const user = await getUser(req)

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
