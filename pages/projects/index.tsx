import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/client'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

import { ProjectCard } from '../../components'
import { api } from '../../lib'
import { DashboardProject } from '../../types'

interface Props {
  projects: DashboardProject[]
}

const Projects: NextPage<Props> = ({ projects }) => (
  <>
    <Head>
      <title>Projects / FlyFly</title>
    </Head>

    <main className="my-12">
      <h1 className="text-4xl font-semibold text-center lg:text-left">
        Projects
      </h1>

      <section className="flex flex-wrap -mx-4">
        {projects.map((project) => (
          <Link href={`/projects/${project.slug}`} key={project.slug}>
            <a className="w-full lg:w-1/3">
              <ProjectCard className="m-4" project={project} />
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

  const projects = await api.get<DashboardProject[]>(context, '/projects')

  return {
    props: {
      projects
    }
  }
}

export default Projects