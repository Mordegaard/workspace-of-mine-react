import React, { useState } from 'react'

import styled from 'styled-components'

const SpoilerContainer = styled.span`
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: inline;

  ${props => props.isVisible ? `
    background-color: transparent;
  ` : `
    color: transparent;
    user-select: none;
    background-color: inherit;
  `}

  &:hover {
    ${props => !props.isVisible ? 'background-color: #ddd;' : ''}
  }
`

export function TextSpoiler ({ part }) {
  const [ isVisible, setIsVisible ] = useState(false)

  return (
    <SpoilerContainer
      onClick={() => setIsVisible(!isVisible)}
      isVisible={isVisible}
    >
      {part}
    </SpoilerContainer>
  )
}
