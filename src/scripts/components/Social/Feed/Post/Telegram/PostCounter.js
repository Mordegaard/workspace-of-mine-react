import React, { useRef } from 'react'

import styled, { keyframes } from 'styled-components'

import { ContextMenu, ContextMenuContainer } from 'scripts/components/ui/Helpers/ContextMenu'
import { PostComments } from 'scripts/components/Social/Feed/Post/PostComments'

export function PostCounter ({ post, interactive = true }) {
  const emojiCount = post.reactions?.reduce((acc, value) => acc + value.count, 0) ?? 0

  const ref = useRef()

  return <span>
    <PostComments
      disabled={!interactive || post.comments === 0}
      post={post}
    />
    <span ref={ref} className='text-gray-500 fs-7'>
    <i className='bi bi-emoji-smile me-1' />
      { emojiCount }
      {
        emojiCount > 0 && <ContextMenu
          containerRef={ref}
          popperOptions={{
            placement: 'bottom',
            modifiers: []
          }}
          trigger={ContextMenu.TRIGGER_HOVER}
        >
          <StyledContextMenuContainer>
            {
              post.reactions.map(({ count, emoji }, index) =>
                <Emoji key={index}>
                  { emoji + '\uFE0F' + count }
                </Emoji>
              )
            }
          </StyledContextMenuContainer>
        </ContextMenu>
      }
  </span>
  </span>
}

const appearing = keyframes`
  0%   { width: 0; right: -50%; opacity: 0; }
  20%  { width: 20%; right: -40%; opacity: 0; }
  60%  { width: 60%; right: -20%; opacity: 1; }
  100% { width: 100%; right: 0; opacity: 1; }
`

const StyledContextMenuContainer = styled(ContextMenuContainer)`
  position: relative;
  border-radius: 666px;
  color: black;
  font-weight: 600;
  text-wrap: nowrap;
  margin: 0 4px;
  overflow: hidden;
  animation: ${appearing} 0.2s linear;
`

const Emoji = styled('span')`
  border-radius: 666px;
  padding: 1px 5px;
  background: rgba(var(--bs-primary-rgb), 0.15);
  
  &:not(:last-child) {
    margin-right: 4px;
  }
`