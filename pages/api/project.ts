import { NextApiRequest, NextApiResponse } from 'next'
import connect from 'next-connect'

import {
  createProject,
  deleteProject,
  getUser,
  updateProject
} from '@flyfly/server'

const handler = connect<NextApiRequest, NextApiResponse>()
  .post(async (req, res) => {
    const user = await getUser(req)

    const {
      body: { name }
    } = req

    const project = await createProject(user, name)

    res.json(project)
  })
  .put(async (req, res) => {
    const user = await getUser(req)

    const {
      body: { name },
      query: { projectId }
    } = req

    const project = await updateProject(user, String(projectId), name)

    res.json(project)
  })
  .delete(async (req, res) => {
    const user = await getUser(req)

    const {
      query: { projectId }
    } = req

    await deleteProject(user, String(projectId))

    res.json({
      status: 'ok'
    })
  })

export default handler
