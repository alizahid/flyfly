import { User } from '@prisma/client'
import React, { FunctionComponent, useState } from 'react'

import { useUpdateProfile } from '@flyfly/hooks'

import { Icon } from '../icon'
import { Modal } from '../modal'
import { Spinner } from '../spinner'

interface Props {
  className?: string
  profile: User
}

export const ProfileCard: FunctionComponent<Props> = ({
  className,
  profile
}) => {
  const [visible, setVisible] = useState(false)

  const [name, setName] = useState<string>(profile.name)
  const [email, setEmail] = useState<string>(profile.email)

  const { loading, updateProfile } = useUpdateProfile()

  const onClose = (next?: User) => {
    setVisible(false)

    if (next) {
      setName(next.name)
      setEmail(next.email)
    } else {
      setName(profile.name)
      setEmail(profile.email)
    }
  }

  return (
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
            color={profile.emailVerified ? 'green' : 'gray'}
            icon="shieldCheckmark"
            title={
              profile.emailVerified ? 'Email verified' : 'Email not verified'
            }
          />
          <Icon
            className="ml-8"
            icon="createOutline"
            onClick={() => setVisible(true)}
          />
        </div>
      </div>

      <Modal
        message=""
        onClose={() => onClose()}
        title="Edit profile"
        type="custom"
        visible={visible}>
        <form
          className="mx-4"
          onSubmit={async (event) => {
            event.preventDefault()

            if (name && email) {
              const next = await updateProfile({
                email,
                name
              })

              onClose(next)
            }
          }}>
          <label>
            <strong>Name</strong>
            <input
              onChange={(event) => setName(event.target.value)}
              placeholder="Name"
              required
              type="text"
              value={name}
            />
          </label>
          <label>
            <strong>Email</strong>
            <input
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              required
              type="email"
              value={email}
            />
          </label>
          <footer className="flex mt-4 -mx-4 border-t border-gray-200">
            <button
              className="bg-transparent rounded-none flex-1 p-4 font-medium text-red-500"
              onClick={() => onClose()}
              type="button">
              Cancel
            </button>
            <button
              className="bg-transparent rounded-none flex-1 flex items-center justify-center p-4 font-medium text-green-500"
              type="submit">
              {loading ? <Spinner /> : 'Submit'}
            </button>
          </footer>
        </form>
      </Modal>
    </>
  )
}
