import { motion } from 'framer-motion'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import React, { useState } from 'react'

import { Icon, Modal, ProjectCard } from '@flyfly/components'
import { useCreateProject, useProjects } from '@flyfly/hooks'
import { getProjects, getUser } from '@flyfly/server'
import { Project } from '@flyfly/types'

type Props = {
  projects: Project[]
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

      <main className="my-16">
        <header className="flex items-center justify-between lg:justify-start">
          <h1 className="text-4xl font-semibold">Projects</h1>
          <Icon className="ml-4" icon="add" onClick={() => setVisible(true)} />
        </header>

        {projects.length > 0 ? (
          <div className="grid lg:grid-cols-3 2xl:grid-cols-4 gap-8 mt-8">
            {projects.map((project, index) => (
              <Link href={`/projects/${project.id}`} key={project.id} passHref>
                <motion.a
                  animate={{
                    opacity: 1
                  }}
                  initial={{
                    opacity: 0
                  }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.1
                  }}>
                  <ProjectCard project={project} />
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
        loading={loading}
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

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req
}) => {
  const user = await getUser(req)

  if (!user) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const projects = await getProjects(user)

  return {
    props: {
      projects,
      user
    }
  }
}

export default Projects
