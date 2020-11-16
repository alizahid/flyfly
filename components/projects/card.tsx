import pluralize from 'pluralize'
import React, { FunctionComponent } from 'react'

import { Project } from '@flyfly/types'

interface Props {
  className?: string
  project: Project
}

export const ProjectCard: FunctionComponent<Props> = ({
  className,
  project
}) => (
  <div
    className={`bg-white flex flex-col duration-200 rounded-lg shadow-sm hover:shadow p-4 ${className}`}>
    <div className="font-medium">{project.name}</div>
    <div className="flex items-center text-gray-600 text-sm mt-2">
      <div>{pluralize('form', project.forms, true)}</div>
      <div className="ml-4">
        {pluralize('response', project.responses, true)}
      </div>
    </div>
  </div>
)
