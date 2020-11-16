import React, { FunctionComponent } from 'react'

import { User } from '@flyfly/types'

import { Icon } from '../icon'

interface Props {
  className?: string
  profile: User
}

export const ProfileCard: FunctionComponent<Props> = ({
  className,
  profile
}) => (
  <>
    <div
      className={`bg-white shadow-sm rounded-lg p-8 lg:p-4 flex flex-col lg:flex-row items-center ${className}`}>
      <img
        className="bg-blue-200 h-20 w-20 rounded-full shadow-sm"
        src={profile.image}
      />
      <div className="my-4 lg:my-0 lg:mx-8 text-center lg:text-left">
        <div className="text-xl font-medium">{profile.name}</div>
        <div className={profile.email ? '' : 'text-gray-500'}>
          {profile.email || 'No email provided'}
        </div>
      </div>
      <div className="flex items-center">
        <Icon
          color={profile.verified ? 'green' : 'gray'}
          icon="shieldCheckmark"
          title={profile.verified ? 'Email verified' : 'Email not verified'}
        />
      </div>
    </div>
  </>
)
