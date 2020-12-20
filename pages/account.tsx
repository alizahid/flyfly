import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import React from 'react'

import {
  NotificationsCard,
  PlanCard,
  ProfileCard,
  UsageCard
} from '@flyfly/components'
import { useProfile } from '@flyfly/hooks'
import { getPlans, getUsage, getUser } from '@flyfly/server'
import { Plan, Usage, User } from '@flyfly/types'

type Props = {
  plans: Plan[]
  usage: Usage
  user: User
}

const Account: NextPage<Props> = (props) => {
  const { profile } = useProfile(props.user)

  return (
    <>
      <Head>
        <title>Account / FlyFly</title>
      </Head>

      <main className="my-16">
        <h1 className="text-4xl font-semibold">Account</h1>

        <h2 className="text-2xl font-semibold mt-8">Profile</h2>
        <ProfileCard className="mt-4" profile={profile} />

        <h2 className="text-2xl font-semibold mt-16">Plan</h2>
        <PlanCard className="mt-4" plans={props.plans} profile={profile} />

        <h2 className="text-2xl font-semibold mt-16">Notifications</h2>
        <NotificationsCard className="mt-4" profile={profile} />

        <h2 className="text-2xl font-semibold mt-16">Usage</h2>
        <UsageCard
          className="mt-4"
          plans={props.plans}
          profile={profile}
          usage={props.usage}
        />
      </main>
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

  const plans = await getPlans()
  const usage = await getUsage(user.id)

  return {
    props: {
      plans,
      usage,
      user
    }
  }
}

export default Account
