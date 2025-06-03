import React from 'react'

import styled from 'styled-components'

import { sourceDescriptions } from 'scripts/methods/social/constants'

function SocialIconBase ({ type, ...props }) {
  const icon = sourceDescriptions[type]?.icon

  return <IconContainer {...props}>
    {
      icon
        ? React.createElement(icon)
        : <i className='bi bi-globe-americas' />
    }
  </IconContainer>
}

export const SocialIcon = React.memo(SocialIconBase)

const IconContainer = styled('div')`
  svg {
    vertical-align: unset;
  }
`