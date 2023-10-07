import styled, { css, keyframes } from 'styled-components'

const fading = keyframes`
  0%   { background: var(--bs-gray-200); }
  50%  { background: var(--bs-gray-100); }
  100% { background: var(--bs-gray-200); }
`

const fadingAnimation = css`animation: ${ fading } 1s linear infinite;`

export const Placeholder = styled('div').attrs(({ $thumbUrl }) => ({
  style: $thumbUrl
    ? { background: `0 0 / 100% url("${ $thumbUrl }")` }
    : {}
}))`
  background: var(--bs-gray-200);
  min-width: 100%;
  height: 100%;
  
  ${({ $thumbUrl }) => !$thumbUrl && fadingAnimation}
`