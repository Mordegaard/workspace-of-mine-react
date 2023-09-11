import styled, { keyframes } from 'styled-components'

const gearAnimation = keyframes`
  from { transform: none; }
  to   { transform: rotate(45deg) }
`

export const SettingsButton = styled('button')`
  text-shadow: 0 0 4px #00000080;
  animation: ${gearAnimation} 0.5s ease forwards;
  
  &:active {
    animation: none;
  }
`