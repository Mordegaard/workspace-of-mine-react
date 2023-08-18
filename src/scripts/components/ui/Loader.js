import React from 'react'

import styled, { keyframes } from 'styled-components'

export function Loader ({ size = 20, color = 'var(--bs-primary)' }) {
  return <StyledLoader size={size} color={color} />
}

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const StyledLoader = styled('div')`
  position: relative;
  display: inline-block;
  border-radius: 50%;
  ${({ size }) => `
    width: ${size}px;
    height: ${size}px;
  `}
  ${({ color }) => `
    border: 4px solid transparent;
    border-top-color: ${color};
  `}
  animation: ${rotate} 1.5s linear infinite;
`
