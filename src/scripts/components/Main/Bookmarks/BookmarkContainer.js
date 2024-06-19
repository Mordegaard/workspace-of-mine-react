import styled from 'styled-components'

export const BookmarkContainer = styled('div')`
  position: relative;
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
    background-color: rgba(var(--bs-gray-100-rgb), 0.36);
    color: var(--bs-body-color);
    text-shadow: none;
    backdrop-filter: blur(4px);
  }
`