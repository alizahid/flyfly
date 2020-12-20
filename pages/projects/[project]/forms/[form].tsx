import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Router from 'next/router'
import React, { useState } from 'react'

import {
  Icon,
  InlineCode,
  Loading,
  Modal,
  ResponseCard,
  Spinner
} from '@flyfly/components'
import {
  useDeleteForm,
  useForm,
  useProject,
  useResponses,
  useUpdateForm
} from '@flyfly/hooks'
import { getForm, getProject, getResponses, getUser } from '@flyfly/server'
import { Form, Project, Response } from '@flyfly/types'

type Props = {
  form: Form
  project: Project
  responses: Response[]
}

const FormPage: NextPage<Props> = (props) => {
  const { form } = useForm(props.form)
  const { project } = useProject(props.project)

  const { loading: updating, updateForm } = useUpdateForm()
  const { deleteForm, loading: deleting } = useDeleteForm()

  const { fetchMore, loading, refetch, responses } = useResponses(
    props.form.id,
    props.responses
  )

  const [updateFormVisible, setUpdateFormVisible] = useState(false)
  const [deleteFormVisible, setDeleteFormVisible] = useState(false)

  if (!form) {
    return <Loading />
  }

  return (
    <>
      <Head>
        <title>
          {form.name} / Forms / {project.name} / Projects / FlyFly
        </title>
      </Head>

      <main className="my-16">
        <Link href={`/projects/${project.id}`}>
          <a className="flex items-center text-gray-700">
            <Icon className="mr-2" color="gray" icon="arrowBack" size={16} />
            {project.name}
          </a>
        </Link>
        <h1 className="text-4xl font-semibold mt-4">{form.name}</h1>

        <h2 className="text-2xl font-semibold mt-8">Instructions</h2>
        <div className="mt-2">
          Send a <code>POST</code> request to this url with your data in{' '}
          <code>JSON</code>.
        </div>
        <InlineCode
          className="mt-4"
          text={`${process.env.URL}/f/${form.slug}`}
        />
        <div className="mt-4">
          View{' '}
          <Link href="/docs">
            <a>docs</a>
          </Link>{' '}
          for examples.
        </div>

        <h2 className="text-2xl font-semibold mt-16">Settings</h2>
        <nav className="flex flex-col items-start">
          <a
            className="flex items-center mt-4 cursor-pointer text-black"
            href="#rename"
            onClick={(event) => {
              event.preventDefault()

              setUpdateFormVisible(true)
            }}>
            <Icon className="mr-2" icon="createOutline" />
            Change name
          </a>
          <a
            className="flex items-center mt-4 cursor-pointer text-red-500"
            href="#delete"
            onClick={(event) => {
              event.preventDefault()

              setDeleteFormVisible(true)
            }}>
            <Icon className="mr-2" color="red" icon="closeCircleOutline" />
            Delete form
          </a>
        </nav>

        <header className="flex items-center justify-between lg:justify-start mt-16">
          <h2 className="text-2xl font-semibold">Responses</h2>
          {loading ? (
            <Spinner className="ml-4" />
          ) : (
            <Icon className="ml-4" icon="reloadOutline" onClick={refetch} />
          )}
        </header>
        {responses.length > 0 ? (
          responses.map((response) => (
            <ResponseCard
              className="mt-4"
              key={response.id}
              response={response}
            />
          ))
        ) : (
          <div className="text-gray-700 mt-4">There are no responses yet.</div>
        )}
        {responses.length > 0 && (
          <button
            className="bg-gradient-to-br from-emerald-400 to-emerald-600 font-medium text-white hover:text-white mx-auto py-2 px-4 rounded-full shadow-sm mt-8"
            onClick={() => fetchMore()}>
            {loading ? <Spinner className="my-2" light /> : 'Load more'}
          </button>
        )}
      </main>

      <Modal
        loading={updating}
        message="What would you like to call it?"
        onClose={() => setUpdateFormVisible(false)}
        onSubmit={(name) => updateForm(project.id, form.id, name)}
        placeholder="Name"
        title="Change form name"
        type="prompt"
        value={form.name}
        visible={updateFormVisible}
      />

      <Modal
        loading={deleting}
        message="Are you sure you want to delete this form? All responses will also be deleted. This cannot be undone."
        onClose={() => setDeleteFormVisible(false)}
        onYes={async () => {
          await deleteForm(project.id, form.id)

          Router.replace(`/projects/${project.id}`)
        }}
        title="Delete form"
        type="confirm"
        visible={deleteFormVisible}
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

  const id = String(params.form)

  const form = await getForm(user, id)

  if (!form) {
    return {
      notFound: true
    }
  }

  const project = await getProject(user, form.projectId)

  const responses = await getResponses(user, form.id, 0)

  return {
    props: {
      form,
      project,
      responses,
      user
    }
  }
}

export default FormPage
