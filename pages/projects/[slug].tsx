import { join, PrismaClient } from '@prisma/client'
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/client'
import Head from 'next/head'
import Link from 'next/link'
import React, { useState } from 'react'

import { FormCard, Icon, Modal, Spinner } from '@flyfly/components'
import { useCreateForm, useProject } from '@flyfly/hooks'
import { serializeJson } from '@flyfly/lib'
import { DashboardProject } from '@flyfly/types'

interface Props {
  project: DashboardProject
}

const Project: NextPage<Props> = ({ project }) => {
  const { data } = useProject(project)

  const { createForm, loading } = useCreateForm()

  const [visible, setVisible] = useState(false)

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
            <Icon icon="addCircle" onClick={() => setVisible(true)} />
          )}
        </header>

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
      </main>

      <Modal
        message="What would you like to call it?"
        onClose={() => setVisible(false)}
        onSubmit={(name) => createForm(data, name)}
        placeholder="Name"
        title="Create a new form"
        type="prompt"
        visible={visible}
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
