import pluralize from 'pluralize'
import React, { FunctionComponent } from 'react'

import { DashboardProject } from '../../types'

interface Props {
  className?: string
  project: DashboardProject
}

export const ProjectCard: FunctionComponent<Props> = ({
  className,
  project
}) => (
  <div
    className={`bg-white flex flex-col duration-200 rounded-lg shadow-sm hover:shadow p-4 ${className}`}>
    <div className="font-medium">{project.name}</div>
    <div className="text-gray-600 text-sm mt-2">
      {pluralize('form', project.forms.length, true)}
    </div>
  </div>
)
