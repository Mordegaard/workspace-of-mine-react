import React from 'react'

import styled from 'styled-components'

import { SOURCE_REDDIT, SOURCE_TELEGRAM, SOURCE_TUMBLR, sourceDescriptions } from 'scripts/methods/social/constants'

function SocialIconBase ({ type, ...props }) {
  let icon

  switch (type) {
    case SOURCE_REDDIT:
      icon = sourceDescriptions[SOURCE_REDDIT].icon
      break
    case SOURCE_TELEGRAM:
      icon = sourceDescriptions[SOURCE_TELEGRAM].icon
      break
    case SOURCE_TUMBLR:
      icon = sourceDescriptions[SOURCE_TUMBLR].icon
      break
  }

  return <IconContainer>
    {
      icon
        ? React.createElement(icon, { ...props })
        : <i className='bi bi-globe-americas' {...props} />
    }
  </IconContainer>
}

export const SocialIcon = React.memo(SocialIconBase)

const IconContainer = styled('div')`
  svg {
    vertical-align: unset;
  }
`