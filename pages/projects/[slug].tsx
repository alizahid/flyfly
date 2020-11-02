import { join } from '@prisma/client'
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/client'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

import { FormCard } from '@flyfly/components'
import { prisma, serializeJson } from '@flyfly/lib'
import { DashboardProject } from '@flyfly/types'

interface Props {
  project: DashboardProject
}

const Project: NextPage<Props> = ({ project }) => (
  <>
    <Head>
      <title>{project.name} / Projects / FlyFly</title>
    </Head>

    <main className="my-12">
      <h1 className="text-4xl font-semibold text-center lg:text-left">
        {project.name}
      </h1>

      <section className="flex flex-wrap -mx-4">
        {project.forms.map((form) => (
          <Link
            href={`/projects/${project.slug}/forms/${form.slug}`}
            key={form.slug}>
            <a className="w-full lg:w-1/3">
              <FormCard className="m-4" form={form} project={project} />
            </a>
          </Link>
        ))}
      </section>
    </main>
  </>
)

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
