import { Form } from '@prisma/client'
import millify from 'millify'
import pluralize from 'pluralize'
import React, { FunctionComponent } from 'react'

import { DashboardProject } from '../../types'

interface Props {
  className?: string
  form: Form
  project: DashboardProject
}

export const FormCard: FunctionComponent<Props> = ({
  className,
  form,
  project
}) => {
  const responses =
    project.responses?.find(({ formId }) => formId === form.id).count ?? 0

  return (
    <div
      className={`bg-white flex flex-col duration-200 rounded-lg shadow-sm hover:shadow p-4 ${className}`}>
      <div className="font-medium">{form.name}</div>
      <div className="text-gray-600 text-sm mt-2">
        {millify(responses)} {pluralize('response', responses)}
      </div>
    </div>
  )
}
