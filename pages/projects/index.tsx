import millify from 'millify'
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/client'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

import { api } from '../../lib'
import { DashboardProject } from '../../types'

interface Props {
  projects: DashboardProject[]
}

const Projects: NextPage<Props> = ({ projects }) => {
  return (
    <>
      <Head>
        <title>Projects / FlyFly</title>
      </Head>

      <main className="my-12">
        <h1 className="text-4xl font-semibold text-center lg:text-left">
          Projects
        </h1>

        {projects.map((project) => (
          <Link href={`/projects/${project.slug}`} key={project.slug}>
            <a className="flex flex-col lg:flex-row items-center mt-8">
              <div className="font-medium">{project.name}</div>
              <div className="w-40 text-right text-gray-600 mt-2 lg:mt-0 lg:ml-auto">
                {millify(project.forms, {
                  precision: 2
                })}{' '}
                {project.forms === 1 ? 'form' : 'forms'}
              </div>
              <div className="w-40 text-right text-gray-600 mt-2 lg:mt-0 lg:ml-4">
                {millify(project.responses, {
                  precision: 2
                })}{' '}
                {project.responses === 1 ? 'response' : 'responses'}
              </div>
            </a>
          </Link>
        ))}
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  if (!session) {
    return {
      props: {},
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
