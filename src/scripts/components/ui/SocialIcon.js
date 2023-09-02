import React from 'react'

import { SOURCE_REDDIT, SOURCE_TELEGRAM } from 'scripts/methods/socialSources/constants'

function SocialIconBase ({ type }) {
  switch (type) {
    case SOURCE_REDDIT:
      return <i className='d-block bi bi-reddit lh-0' />
    case SOURCE_TELEGRAM:
      return <i className='d-block bi bi-telegram lh-0' />
    default:
      return null
  }
}

export const SocialIcon = React.memo(SocialIconBase)