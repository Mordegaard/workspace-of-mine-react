import styled from 'styled-components'

export const Tag = styled('span')`
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 666px;
  white-space: nowrap;

  ${props => `
    background: ${props.background || 'var(--bs-primary)'};
    color: ${props.color || 'white'};
  `}

  ${({ round }) => round && `
    line-height: 0;
    padding: 6px;
  `}
`
