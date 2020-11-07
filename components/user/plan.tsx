import { User } from '@prisma/client'
import React, { FunctionComponent } from 'react'

interface Props {
  className?: string
  profile: User
}

export const PlanCard: FunctionComponent<Props> = ({ className }) => (
  <div
    className={`bg-white shadow-sm rounded-lg p-8 lg:p-4 flex flex-col lg:flex-row items-center ${className}`}>
    <div className="text-center lg:text-left text-xl font-medium mb-4 lg:mb-0 lg:mr-8">
      Beta
    </div>
    <span className="text-center text-gray-700">
      Everything is unlimited during the beta period
    </span>
  </div>
)
