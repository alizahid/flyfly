import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import React from 'react'

import { NotificationsCard, PlanCard, ProfileCard } from '@flyfly/components'
import { useProfile } from '@flyfly/hooks'
import { getUser } from '@flyfly/server'
import { User } from '@flyfly/types'

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

        <h2 className="text-2xl font-medium mt-16">Notifications</h2>
        <NotificationsCard className="mt-4" profile={profile} />

        <h2 className="text-2xl font-medium mt-16">Usage</h2>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req
}) => {
  const user = await getUser(req, true)

  if (!user) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      user
    }
  }
}

export default Account
