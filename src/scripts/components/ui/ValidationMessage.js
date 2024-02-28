import React from 'react'

import { mergeClasses } from 'scripts/methods/helpers'

export function ValidationMessage ({ type = TYPE_ERROR, errors, property }) {
  if (!Object.hasOwn(errors, property)) return null

  return <div className='d-flex align-items-center'>
    {
      ICONS_MAPPING[type] && <i className={mergeClasses('bi', `bi-${ICONS_MAPPING[type]}`, 'me-2')} />
    }
    {
      errors[property]
    }
  </div>
}

const TYPE_ERROR = 'error'
const TYPE_WARNING = 'warning'

const ICONS_MAPPING = {
  [TYPE_ERROR]: 'exclamation-circle',
  [TYPE_WARNING]: 'exclamation-triangle'
}