import millify from 'millify'
import pluralize from 'pluralize'
import React, { FunctionComponent } from 'react'

import { FormWithResponseCount } from '@flyfly/types'

interface Props {
  className?: string
  form: FormWithResponseCount
}

export const FormCard: FunctionComponent<Props> = ({ className, form }) => (
  <div
    className={`bg-white flex flex-col duration-200 rounded-lg shadow-sm hover:shadow p-4 ${className}`}>
    <div className="font-medium">{form.name}</div>
    <div className="text-gray-600 text-sm mt-2">
      {`${millify(form.responses)} ${pluralize('response', form.responses)}`}
    </div>
  </div>
)
