import { signIn } from 'next-auth/client'
import React, { FunctionComponent } from 'react'

import { Icon } from './icon'

export const GetStarted: FunctionComponent = () => (
  <>
    <button
      className="bg-white flex items-center py-4 px-6 rounded-full shadow-sm"
      onClick={() => signIn('github')}>
      <span className="text-black font-medium text-xl">
        Get started with GitHub
      </span>
      <Icon className="ml-4" icon="logoGithub" />
    </button>
    <div className="text-gray-600 mt-4">No credit card required</div>
  </>
)
