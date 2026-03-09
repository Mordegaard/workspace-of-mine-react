import styled from 'styled-components'

export const Anchor = styled('a')`
  color: ${({ $color }) => $color || 'inherit'};
  
  &:hover {
    color: var(--bs-primary);
  }
`