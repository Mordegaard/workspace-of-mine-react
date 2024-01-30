import React, { useRef, useState } from 'react'

import styled, { css, keyframes } from 'styled-components'

import { ContextMenu, ContextMenuContainer } from 'scripts/components/ui/Helpers/ContextMenu'
import { PostComments } from 'scripts/components/Social/Feed/Post/PostComments'
import { TelegramManager } from 'scripts/methods/telegram'
import { mergeClasses } from 'scripts/methods/helpers'
import { SocialController } from 'scripts/methods/social'

/**
 * @param {FormattedPost} post
 * @param interactive
 * @param {Object} props
 * @return {JSX.Element}
 * @constructor
 */
export function PostCounter ({ post, interactive = true, ...props }) {
  const [ key, setKey ] = useState(Number(new Date))

  const emojiCount = post.reactions?.reduce((acc, value) => acc + value.count, 0) ?? 0

  const ref = useRef()

  async function sendReaction (emoticon) {
    const original = post.originalPost
    const peer = original.peerId.channelId ?? original.fromId.userId
    const msgId = original.id

    const reaction = typeof emoticon === 'string'
      ? new telegram.Api.ReactionEmoji({ emoticon })
      : new telegram.Api.ReactionCustomEmoji({
        documentId: telegram.helpers.returnBigInt(emoticon.props.document.id)
      })

    const params = {
      reaction: [reaction],
      addToRecent: true,
      peer,
      msgId,
    }

    const { updates } = await TelegramManager.client.invoke(
      new telegram.Api.messages.SendReaction(params)
    )

    post.reactions = await SocialController.posts.telegram.getReactions(updates[0])

    setKey(Number(new Date))
  }

  return <div>
    <PostComments
      disabled={!interactive || post.comments === 0}
      post={post}
    />
    <span
      {...props}
      ref={ref}
      className={
        mergeClasses(emojiCount === 0 ? props.className : 'btn btn-sm btn-pill btn-basic-primary')
      }
    >
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
                post.reactions.map(({ count, emoji, selected }, index) =>
                  <Emoji key={index} $selected={selected} onClick={() => sendReaction(emoji)}>
                    { emoji }{ count }
                  </Emoji>
                )
              }
            </StyledContextMenuContainer>
          </ContextMenu>
        }
    </span>
  </div>
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
  
  ${({ $selected }) => $selected
          ? css`
            background: rgba(var(--bs-primary-rgb), 0.33);
            outline: 4px solid rgba(var(--bs-primary-rgb), 0.2);
          `
          : css`background: rgba(var(--bs-gray-200-rgb), 0.33);`
  }
  
  &:not(:last-child) {
    margin-right: 4px;
  }
`