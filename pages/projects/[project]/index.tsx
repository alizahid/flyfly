import { motion } from 'framer-motion'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Router from 'next/router'
import React, { useState } from 'react'

import { FormCard, Icon, Loading, Modal } from '@flyfly/components'
import {
  useCreateForm,
  useDeleteProject,
  useForms,
  useProject,
  useUpdateProject
} from '@flyfly/hooks'
import { getForms, getProject, getUser } from '@flyfly/server'
import { Form, Project } from '@flyfly/types'

interface Props {
  project: Project
  forms: Form[]
}

const ProjectPage: NextPage<Props> = (props) => {
  const { project } = useProject(props.project)
  const { forms } = useForms(props.project.id, props.forms)

  const { createForm, loading: creating } = useCreateForm()
  const { deleteProject, loading: deleting } = useDeleteProject()
  const { loading: updating, updateProject } = useUpdateProject()

  const [newProjectVisible, setNewProjectVisible] = useState(false)
  const [updateProjectVisible, setUpdateProjectVisible] = useState(false)
  const [deleteProjectVisible, setDeleteProjectVisible] = useState(false)

  if (!project) {
    return <Loading />
  }

  return (
    <>
      <Head>
        <title>{project.name} / Projects / FlyFly</title>
      </Head>

      <main className="my-16">
        <Link href="/projects">
          <a className="flex items-center text-gray-700">
            <Icon className="mr-2" color="gray" icon="arrowBack" size={16} />
            Projects
          </a>
        </Link>
        <h1 className="text-4xl font-semibold mt-4">{project.name}</h1>

        <header className="flex items-center justify-between lg:justify-start mt-8">
          <h2 className="text-2xl font-medium">Forms</h2>
          <Icon
            className="ml-4"
            icon="add"
            onClick={() => setNewProjectVisible(true)}
          />
        </header>
        {forms.length > 0 ? (
          <div className="grid lg:grid-cols-3 2xl:grid-cols-4 gap-8 mt-4">
            {forms.map((form, index) => (
              <Link
                href={`/projects/${project.id}/forms/${form.id}`}
                key={form.id}
                passHref>
                <motion.a
                  animate={{
                    opacity: 1
                  }}
                  className="static"
                  initial={{
                    opacity: 0
                  }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.1
                  }}>
                  <FormCard form={form} />
                </motion.a>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-gray-700 mt-4">
            You haven&#39;t created any projects yet.
          </div>
        )}

        <h2 className="text-2xl font-medium mt-16">Settings</h2>
        <nav className="flex flex-col items-start">
          <a
            className="flex items-center mt-4 cursor-pointer text-black"
            href="#rename"
            onClick={(event) => {
              event.preventDefault()

              setUpdateProjectVisible(true)
            }}>
            <Icon className="mr-2" icon="createOutline" />
            Change name
          </a>
          <a
            className="flex items-center mt-4 cursor-pointer text-red-500"
            href="#delete"
            onClick={(event) => {
              event.preventDefault()

              setDeleteProjectVisible(true)
            }}>
            <Icon className="mr-2" color="red" icon="closeCircleOutline" />
            Delete project
          </a>
        </nav>
      </main>

      <Modal
        loading={creating}
        message="What would you like to call it?"
        onClose={() => setNewProjectVisible(false)}
        onSubmit={(name) => createForm(project.id, name)}
        placeholder="Name"
        title="Create a new form"
        type="prompt"
        visible={newProjectVisible}
      />

      <Modal
        loading={updating}
        message="What would you like to call it?"
        onClose={() => setUpdateProjectVisible(false)}
        onSubmit={(name) => updateProject(project.id, name)}
        placeholder="Name"
        title="Change project name"
        type="prompt"
        value={project.name}
        visible={updateProjectVisible}
      />

      <Modal
        loading={deleting}
        message="Are you sure you want to delete this project? All forms and responses will also be deleted. This cannot be undone."
        onClose={() => setDeleteProjectVisible(false)}
        onYes={async () => {
          await deleteProject(project.id)

          Router.replace('/projects')
        }}
        title="Delete project"
        type="confirm"
        visible={deleteProjectVisible}
      />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  params,
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

  const id = String(params.project)

  const project = await getProject(user, id)

  if (!project) {
    return {
      notFound: true
    }
  }

  const forms = await getForms(user, id)

  return {
    props: {
      forms,
      project,
      user
    }
  }
}

export default ProjectPage
