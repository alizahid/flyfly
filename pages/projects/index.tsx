import { PrismaClient } from '@prisma/client'
import { motion } from 'framer-motion'
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/client'
import Head from 'next/head'
import Link from 'next/link'
import React, { useState } from 'react'

import { Icon, Modal, ProjectCard, Spinner } from '@flyfly/components'
import { useCreateProject, useProjects } from '@flyfly/hooks'
import { serializeJson } from '@flyfly/lib'
import { ProjectWithFormCount } from '@flyfly/types'

interface Props {
  projects: ProjectWithFormCount[]
}

const Projects: NextPage<Props> = (props) => {
  const { projects } = useProjects(props.projects)

  const { createProject, loading } = useCreateProject()

  const [visible, setVisible] = useState(false)

  return (
    <>
      <Head>
        <title>Projects / FlyFly</title>
      </Head>

      <main>
        <header className="flex items-center justify-between lg:justify-start">
          <h1 className="text-4xl font-semibold text-center lg:text-left">
            Projects
          </h1>
          {loading ? (
            <Spinner className="ml-4" />
          ) : (
            <Icon
              className="ml-4"
              icon="add"
              onClick={() => setVisible(true)}
            />
          )}
        </header>

        {projects.length > 0 ? (
          <div className="flex flex-wrap mt-4 -mx-4">
            {projects.map((project, index) => (
              <Link
                href={`/projects/${project.slug}`}
                key={project.slug}
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
                  <ProjectCard className="m-4" project={project} />
                </motion.a>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-700">
            You haven&#39;t created any projects yet.
          </div>
        )}
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

  const next: ProjectWithFormCount[] = projects.map((project) => ({
    ...project,
    forms: project.forms.length
  }))

  return {
    props: {
      projects: serializeJson(next)
    }
  }
}

export default Projects
