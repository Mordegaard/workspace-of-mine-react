import styled from 'styled-components'

export const SIZE = 36

export const RoundButton = styled('button').attrs({
  className: 'btn btn-round bg-gray-100 flexed shadowed'
})`
  position: relative;
  width: ${SIZE}px;
  height: ${SIZE}px;
  
  &:active {
    transform: scale(0.9);
  }
`