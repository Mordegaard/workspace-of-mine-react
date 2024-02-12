import React from 'react'

import styled, { css, keyframes } from 'styled-components'

const fading = keyframes`
  0%   { background: var(--bs-gray-200); }
  50%  { background: var(--bs-gray-100); }
  100% { background: var(--bs-gray-200); }
`

const fadingAnimation = css`animation: ${ fading } 1s linear infinite;`

export function Placeholder ({ children, thumbUrl, blur = false, ...props }) {
  return <PlaceholderContainer $animated={!thumbUrl} {...props}>
    { thumbUrl && <Thumb $thumbUrl={thumbUrl} $blur={blur} /> }
    { children }
  </PlaceholderContainer>
}

const PlaceholderContainer = styled('div')`
  position: relative;
  background: var(--bs-gray-200);
  min-width: 100%;
  height: 100%;
  
  ${({ $animated }) => $animated && fadingAnimation}
`

const Thumb = styled('div').attrs(({ $thumbUrl, $blur }) => ({
  style: {
    background: $thumbUrl ? `0 0 / 100% url("${ $thumbUrl }")` : '',
    filter: $blur ? 'blur(8px)' : ''
  }
}))`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`