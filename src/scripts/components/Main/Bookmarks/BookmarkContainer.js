import styled from 'styled-components'

export const BookmarkContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 12px;
  border-radius: 12px;
  text-shadow: 1px 1px 6px #00000080;
  color: white;
  cursor: pointer;
  
  &:hover {
    background-color: #ffffff80;
    color: black;
    text-shadow: none;
    backdrop-filter: blur(4px);
  }
`