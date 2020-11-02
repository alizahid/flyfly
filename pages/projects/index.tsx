import { PrismaClient } from '@prisma/client'
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/client'
import Head from 'next/head'
import Link from 'next/link'
import React, { useState } from 'react'

import { Icon, Modal, ProjectCard, Spinner } from '@flyfly/components'
import { useCreateProject, useProjects } from '@flyfly/hooks'
import { serializeJson } from '@flyfly/lib'
import { DashboardProject } from '@flyfly/types'

interface Props {
  projects: DashboardProject[]
}

const Projects: NextPage<Props> = ({ projects }) => {
  const { data } = useProjects(projects)

  const { createProject, loading } = useCreateProject()

  const [visible, setVisible] = useState(false)

  return (
    <>
      <Head>
        <title>Projects / FlyFly</title>
      </Head>

      <main className="my-12">
        <header className="flex items-center justify-between">
          <h1 className="text-4xl font-semibold text-center lg:text-left">
            Projects
          </h1>
          {loading ? (
            <Spinner />
          ) : (
            <Icon icon="add" onClick={() => setVisible(true)} />
          )}
        </header>

        <div className="flex flex-wrap mt-4 -mx-4">
          {data.map((project) => (
            <Link href={`/projects/${project.slug}`} key={project.slug}>
              <a className="w-full lg:w-1/3">
                <ProjectCard className="m-4" project={project} />
              </a>
            </Link>
          ))}
        </div>
      </main>

      <Modal
        message="What would you like to call it?"
        onClose={() => setVisible(false)}
        onSubmit={(name) => createProject(name)}
        placeholder="Name"
        title="Create a new project"
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

  const { user } = session

  const projects = await prisma.project.findMany({
    include: {
      forms: true
    },
    orderBy: {
      createdAt: 'asc'
    },
    where: {
      userId: user.id
    }
  })

  return {
    props: {
      projects: serializeJson(projects)
    }
  }
}

export default Projects
