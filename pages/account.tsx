import { User } from '@prisma/client'
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/client'
import Head from 'next/head'
import React from 'react'

import { PlanCard, ProfileCard } from '@flyfly/components'
import { useProfile } from '@flyfly/hooks'
import { serializeJson } from '@flyfly/lib'

interface Props {
  user: User
}

const Account: NextPage<Props> = (props) => {
  const { profile } = useProfile(props.user)

  return (
    <>
      <Head>
        <title>Account / FlyFly</title>
      </Head>

      <main>
        <h1 className="text-4xl font-semibold">Account</h1>

        <h2 className="text-2xl font-medium mt-8">Profile</h2>
        <ProfileCard className="mt-4" profile={profile} />

        <h2 className="text-2xl font-medium mt-16">Plan</h2>
        <PlanCard className="mt-4" profile={profile} />
      </main>
    </>
  )
}

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

  return {
    props: {
      user: serializeJson(user)
    }
  }
}

export default Account
