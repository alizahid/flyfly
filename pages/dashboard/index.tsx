import { Project } from '@prisma/client'
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/client'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

import { api } from '../../lib'

interface Props {
  projects: Project[]
}

const Dashboard: NextPage<Props> = ({ projects }) => {
  return (
    <>
      <Head>
        <title>Dashboard / FlyFly</title>
      </Head>

      <main className="my-12 lg:my-0">
        <h1 className="text-4xl font-semibold">Projects</h1>

        {projects.map((project) => (
          <Link href={`/projects/${project.slug}`} key={project.slug}>
            <a className=" mt-8">
              <div>{project.name}</div>
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

  const projects = await api.get(context, '/projects')

  return {
    props: {
      projects
    }
  }
}

export default Dashboard
