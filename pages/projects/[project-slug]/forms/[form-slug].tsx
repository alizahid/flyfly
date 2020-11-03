import { PrismaClient, Project } from '@prisma/client'
import { AnimatePresence, motion } from 'framer-motion'
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/client'
import Head from 'next/head'
import Link from 'next/link'
import Router from 'next/router'
import React, { useState } from 'react'

import {
  Code,
  Icon,
  InlineCode,
  Loading,
  Modal,
  ResponseCard,
  Spinner
} from '@flyfly/components'
import { useDeleteForm, useForm, useUpdateForm } from '@flyfly/hooks'
import { serializeJson } from '@flyfly/lib'
import { FormWithResponses } from '@flyfly/types'

interface Props {
  form: FormWithResponses
  project: Project
}

const Form: NextPage<Props> = (props) => {
  const { fetchMore, form, loading, refetch } = useForm(props.form)

  const { updateForm } = useUpdateForm()
  const { deleteForm } = useDeleteForm()

  const [expanded, setExpanded] = useState(false)

  const [updateFormVisible, setUpdateFormVisible] = useState(false)
  const [deleteFormVisible, setDeleteFormVisible] = useState(false)

  if (!form) {
    return <Loading />
  }

  const { project } = props

  const url = `${process.env.NEXTAUTH_URL}/form/${form.slug}`

  return (
    <>
      <Head>
        <title>
          {form.name} / Forms / {project.name} / Projects / FlyFly
        </title>
      </Head>

      <main>
        <Link href={`/projects/${project.slug}`}>
          <a className="flex items-center text-gray-700">
            <Icon className="mr-2" color="gray" icon="arrowBack" size={16} />
            {project.name}
          </a>
        </Link>
        <h1 className="text-4xl font-semibold mt-4">{form.name}</h1>

        <h2 className="text-2xl font-medium mt-8">Instructions</h2>
        <div className="mt-2">
          Send a <code>POST</code> request to this url with your data in{' '}
          <code>JSON</code>.
        </div>
        <InlineCode className="mt-4" text={url} />
        <a
          className="flex items-center mt-4"
          href="#examples"
          onClick={(event) => {
            event.preventDefault()

            setExpanded(!expanded)
          }}>
          <h3 className="text-black text-xl font-medium">Examples</h3>
          <Icon
            className="ml-4"
            icon={expanded ? 'chevronUp' : 'chevronDown'}
          />
        </a>
        <AnimatePresence>
          {expanded && (
            <motion.div
              animate={{
                height: 'auto'
              }}
              className="overflow-hidden mt-4"
              exit={{
                height: 0
              }}
              initial={{
                height: 0
              }}
              transition={{
                duration: 0.2
              }}>
              <Code
                code={`await fetch('${url}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Ali',
    email: 'hi@flyfly.dev'
  })
})`}
                language="typescript"
              />
              <div className="mt-4">
                View{' '}
                <Link href="/docs">
                  <a>docs</a>
                </Link>{' '}
                for more examples.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <h2 className="text-2xl font-medium mt-16">Settings</h2>
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
          <h2 className="text-2xl font-medium">Responses</h2>
          <Icon
            className="ml-4"
            icon="reloadOutline"
            onClick={() => refetch()}
          />
        </header>
        {form.responses.length > 0 ? (
          form.responses.map((response) => (
            <ResponseCard
              className="mt-4"
              key={response.id}
              response={response}
            />
          ))
        ) : (
          <div className="text-gray-700 mt-4">There are no responses yet.</div>
        )}
        {form.responses.length > 0 && (
          <button
            className="bg-blue-500 text-white mx-auto py-2 px-4 rounded-full shadow-sm mt-8"
            onClick={() => fetchMore()}>
            Load more
          </button>
        )}
        {loading && <Spinner className="mx-auto mt-8" />}
      </main>

      <Modal
        message="What would you like to call it?"
        onClose={() => setUpdateFormVisible(false)}
        onSubmit={(name) => updateForm(project, form, name)}
        placeholder="Name"
        title="Change form name"
        type="prompt"
        value={form.name}
        visible={updateFormVisible}
      />

      <Modal
        message="Are you sure you want to delete this form? All responses will also be deleted. This cannot be undone."
        onClose={() => setDeleteFormVisible(false)}
        onYes={() => {
          deleteForm(project, form.slug)

          Router.replace(`/projects/${project.slug}`)
        }}
        title="Delete form"
        type="confirm"
        visible={deleteFormVisible}
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

  const { params } = context

  const slug = String(params['form-slug'])

  const { user } = session

  const form = await prisma.form.findOne({
    include: {
      project: {
        include: {
          user: true
        }
      },
      responses: {
        orderBy: {
          createdAt: 'desc'
        },
        take: 20
      }
    },
    where: {
      slug
    }
  })

  if (!form || form.project.user.id !== user.id) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      form: serializeJson(form),
      project: serializeJson(form.project)
    }
  }
}

export default Form
