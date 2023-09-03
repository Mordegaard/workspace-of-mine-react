import styled from 'styled-components'

export const Anchor = styled('a')`
  color: ${({ $color }) => $color || 'initial'};
  
  &:hover {
    color: var(--bs-primary);
  }
`