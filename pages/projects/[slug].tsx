import { join, PrismaClient } from '@prisma/client'
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/client'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

import { FormCard, Icon, Loading, Modal, Spinner } from '@flyfly/components'
import {
  useCreateForm,
  useDeleteProject,
  useProject,
  useUpdateProject
} from '@flyfly/hooks'
import { serializeJson } from '@flyfly/lib'
import { DashboardProject } from '@flyfly/types'

interface Props {
  project: DashboardProject
}

const Project: NextPage<Props> = ({ project }) => {
  const { replace } = useRouter()

  const { data } = useProject(project)

  const { createForm, loading } = useCreateForm()
  const { deleteProject } = useDeleteProject()
  const { updateProject } = useUpdateProject()

  const [newProjectVisible, setNewProjectVisible] = useState(false)
  const [updateProjectVisible, updateNewProjectVisible] = useState(false)
  const [deleteProjectVisible, deleteNewProjectVisible] = useState(false)

  if (!data) {
    replace('/projects')

    return <Loading />
  }

  return (
    <>
      <Head>
        <title>{data.name} / Projects / FlyFly</title>
      </Head>

      <main className="my-12">
        <header className="flex items-center justify-between">
          <h1 className="text-4xl font-semibold text-center lg:text-left">
            {data.name}
          </h1>
          {loading ? (
            <Spinner />
          ) : (
            <Icon icon="add" onClick={() => setNewProjectVisible(true)} />
          )}
        </header>

        <h2 className="text-2xl font-medium mt-8">Forms</h2>
        <div className="flex flex-wrap -mx-4">
          {data.forms.map((form) => (
            <Link
              href={`/projects/${data.slug}/forms/${form.slug}`}
              key={form.slug}>
              <a className="w-full lg:w-1/3">
                <FormCard className="m-4" form={form} project={data} />
              </a>
            </Link>
          ))}
        </div>

        <h2 className="text-2xl font-medium mt-8">Settings</h2>
        <nav className="flex flex-col items-start">
          <a
            className="flex items-center mt-4 cursor-pointer text-blue-500"
            href="#rename"
            onClick={(event) => {
              event.preventDefault()

              updateNewProjectVisible(true)
            }}>
            <Icon className="mr-2" color="blue" icon="createOutline" />
            Change name
          </a>
          <a
            className="flex items-center mt-4 cursor-pointer text-red-500"
            href="#delete"
            onClick={(event) => {
              event.preventDefault()

              deleteNewProjectVisible(true)
            }}>
            <Icon className="mr-2" color="red" icon="closeCircleOutline" />
            Delete project
          </a>
        </nav>
      </main>

      <Modal
        message="What would you like to call it?"
        onClose={() => setNewProjectVisible(false)}
        onSubmit={(name) => createForm(data, name)}
        placeholder="Name"
        title="Create a new form"
        type="prompt"
        visible={newProjectVisible}
      />

      <Modal
        message="What would you like to call it?"
        onClose={() => updateNewProjectVisible(false)}
        onSubmit={(name) => updateProject(data, name)}
        placeholder="Name"
        title="Change project name"
        type="prompt"
        value={data.name}
        visible={updateProjectVisible}
      />

      <Modal
        message="Are you sure you want to delete this project? All forms and responses will also be deleted. This cannot be undone."
        onClose={() => deleteNewProjectVisible(false)}
        onYes={() => deleteProject(data.slug)}
        title="Delete project"
        type="confirm"
        visible={deleteProjectVisible}
      />
    </>
  )
}

const prisma = new PrismaClient()

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const {
    params: { slug }
  } = context

  const { user } = session

  const project = await prisma.project.findFirst({
    include: {
      forms: {
        orderBy: {
          createdAt: 'asc'
        }
      }
    },
    where: {
      slug: String(slug),
      userId: user.id
    }
  })

  if (!project) {
    return {
      notFound: true
    }
  }

  let responses: DashboardProject['responses']

  if (project.forms.length > 0) {
    responses = await prisma.$queryRaw`SELECT "formId", COUNT(id) AS count FROM "Response" WHERE "formId" IN (${join(
      project.forms.map(({ id }) => id)
    )}) GROUP BY "formId"`
  }

  return {
    props: {
      project: serializeJson({
        ...project,
        responses
      })
    }
  }
}

export default Project
