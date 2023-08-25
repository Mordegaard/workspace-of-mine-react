import React from 'react'
import { SOURCE_REDDIT, SOURCE_TELEGRAM } from 'scripts/methods/socialSources'

function SocialIconBase ({ type }) {
  switch (type) {
    case SOURCE_REDDIT:
      return <i className='bi bi-reddit lh-0' />
    case SOURCE_TELEGRAM:
      return <i className='bi bi-telegram lh-0' />
    default:
      return null
  }
}

export const SocialIcon = React.memo(SocialIconBase)