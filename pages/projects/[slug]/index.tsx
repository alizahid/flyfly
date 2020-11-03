import { join, PrismaClient } from '@prisma/client'
import { motion } from 'framer-motion'
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
import { ProjectWithFormsWithResponseCount } from '@flyfly/types'

interface Props {
  project: ProjectWithFormsWithResponseCount
}

const Project: NextPage<Props> = (props) => {
  const { replace } = useRouter()

  const { project } = useProject(props.project)

  const { createForm, loading } = useCreateForm()
  const { deleteProject } = useDeleteProject()
  const { updateProject } = useUpdateProject()

  const [newProjectVisible, setNewProjectVisible] = useState(false)
  const [updateProjectVisible, updateNewProjectVisible] = useState(false)
  const [deleteProjectVisible, deleteNewProjectVisible] = useState(false)

  if (!project) {
    replace('/projects')

    return <Loading />
  }

  return (
    <>
      <Head>
        <title>{project.name} / Projects / FlyFly</title>
      </Head>

      <main>
        <h1 className="text-4xl font-semibold text-center lg:text-left">
          {project.name}
        </h1>

        <header className="flex items-center justify-between lg:justify-start mt-8">
          <h2 className="text-2xl font-medium">Forms</h2>
          {loading ? (
            <Spinner className="ml-4" />
          ) : (
            <Icon
              className="ml-4"
              icon="add"
              onClick={() => setNewProjectVisible(true)}
            />
          )}
        </header>
        {project.forms.length > 0 ? (
          <div className="flex flex-wrap -mx-4">
            {project.forms.map((form, index) => (
              <Link
                href={`/projects/${project.slug}/forms/${form.slug}`}
                key={form.slug}
                passHref>
                <motion.a
                  animate={{
                    opacity: 1
                  }}
                  className="w-full lg:w-1/3"
                  initial={{
                    opacity: 0
                  }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.1
                  }}>
                  <FormCard className="m-4" form={form} />
                </motion.a>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-gray-700 mt-4">
            You haven&#39;t created any projects yet.
          </div>
        )}

        <h2 className="text-2xl font-medium mt-8">Settings</h2>
        <nav className="flex flex-col items-start">
          <a
            className="flex items-center mt-4 cursor-pointer text-black"
            href="#rename"
            onClick={(event) => {
              event.preventDefault()

              updateNewProjectVisible(true)
            }}>
            <Icon className="mr-2" icon="createOutline" />
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
        onSubmit={(name) => createForm(project, name)}
        placeholder="Name"
        title="Create a new form"
        type="prompt"
        visible={newProjectVisible}
      />

      <Modal
        message="What would you like to call it?"
        onClose={() => updateNewProjectVisible(false)}
        onSubmit={(name) => updateProject(project, name)}
        placeholder="Name"
        title="Change project name"
        type="prompt"
        value={project.name}
        visible={updateProjectVisible}
      />

      <Modal
        message="Are you sure you want to delete this project? All forms and responses will also be deleted. This cannot be undone."
        onClose={() => deleteNewProjectVisible(false)}
        onYes={() => deleteProject(project.slug)}
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

  let responses: {
    count: number
    formId: number
  }[] = []

  if (project.forms.length > 0) {
    responses = await prisma.$queryRaw`SELECT "formId", COUNT(id) AS count FROM "Response" WHERE "formId" IN (${join(
      project.forms.map(({ id }) => id)
    )}) GROUP BY "formId"`
  }

  const next: ProjectWithFormsWithResponseCount = {
    ...project,
    forms: project.forms.map((form) => ({
      ...form,
      responses: responses.find(({ formId }) => formId === form.id)?.count ?? 0
    }))
  }

  return {
    props: {
      project: serializeJson(next)
    }
  }
}

export default Project
