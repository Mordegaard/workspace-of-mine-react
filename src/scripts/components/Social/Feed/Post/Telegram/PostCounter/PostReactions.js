import React, { useRef, useState } from 'react'

import styled, { css, keyframes } from 'styled-components'

import { mergeClasses } from 'scripts/methods/helpers'
import { ContextMenu, ContextMenuContainer } from 'scripts/components/ui/Helpers/ContextMenu'
import { TelegramManager } from 'scripts/methods/telegram'
import { SocialController } from 'scripts/methods/social'
import { CustomEmoji } from 'scripts/components/Social/Feed/Post/Telegram/PostMediaItem/CustomEmoji'
import { MAX_UNIQUE_REACTIONS } from 'scripts/methods/social/constants'

/**
 *
 * @param {FormattedPost} post
 * @param {Object} props
 * @return {JSX.Element}
 * @constructor
 */
export function PostReactions ({ post, ...props }) {
  // eslint-disable-next-line no-unused-vars
  const [ key, setKey ] = useState(Number(new Date))
  const [ allReactions, setAllReactions ] = useState([])

  const emojiCount   = post.reactions?.reduce((acc, value) => acc + value.count, 0) ?? 0
  const columnsCount = allReactions.length === 0 ? 0 : Math.max(post.reactions.length, 4)

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

  async function fetchAvailableReactions () {
    let reactions

    if (post.source) {
      const { fullChat } = await TelegramManager.getChannel(post.source.key)
      ;({ reactions } = fullChat.availableReactions)
    } else {
      ({ reactions } = await TelegramManager.client.invoke(
        new telegram.Api.messages.GetAvailableReactions({ hash: 0 })
      ))

      reactions = reactions.map(({ reaction }) => ({ emoticon: reaction }))
    }

    const documentIds = reactions.map(({ documentId }) => documentId).filter(Boolean)
    const documents = await TelegramManager.getCustomEmojis(documentIds)

    setAllReactions(
      reactions.map(reaction => {
        if (reaction.documentId) {
          const foundDocument = documents.find(document => String(document.id) === String(reaction.documentId))

          return <CustomEmoji
            key={String(foundDocument.id)}
            document={foundDocument}
          />
        }

        return reaction.emoticon + '\uFE0F'
      })
    )
  }

  return <span
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
          <ReactionsContainer $columnsCount={columnsCount}>
            {
              post.reactions.map(({ count, emoji, selected }, index) =>
                <Reaction key={index} $selected={selected} onClick={() => sendReaction(emoji)}>
                  { emoji }{ count }
                </Reaction>
              )
            }
            {
              allReactions.length === 0
              && post.reactions.length < MAX_UNIQUE_REACTIONS
              && <Reaction onClick={fetchAvailableReactions}>+Ще</Reaction>
            }
          </ReactionsContainer>
          {
            allReactions.length > 0 && <>
              <hr />
              <ScrollableReactionsContainer $columnsCount={columnsCount}>
                {
                  allReactions.map((emoji, index) =>
                    <AvailableReaction key={index} onClick={() => sendReaction(emoji)}>
                      { emoji }
                    </AvailableReaction>
                  )
                }
              </ScrollableReactionsContainer>
            </>
          }
        </StyledContextMenuContainer>
      </ContextMenu>
    }
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
  border-radius: 20px;
  color: var(--bs-body-color);
  font-weight: 600;
  text-wrap: nowrap;
  margin: 0 4px;
  overflow: hidden;
  animation: ${appearing} 0.2s linear;
`

const ReactionsContainer = styled('div')`
  ${({ $columnsCount }) => $columnsCount > 0 && css`
    display: grid;
    grid-template-columns: repeat(${$columnsCount}, 1fr);
  `}
`

const ScrollableReactionsContainer = styled(ReactionsContainer)`
  max-height: 300px;
  overflow: auto;
`

const reactionStyles = css`
  border-radius: 666px;
  padding: 1px 5px;
  margin: 2px;
`

const Reaction = styled('span')`
  ${reactionStyles};
  
  ${({ $selected }) => $selected
  ? css`
            background: rgba(var(--bs-primary-rgb), 0.33);
            outline: 4px solid rgba(var(--bs-primary-rgb), 0.2);
          `
  : css`background: rgba(var(--bs-gray-500-rgb), 0.12);`
}
`

const AvailableReaction = styled('span')`
  ${reactionStyles};
  
  border: 2px solid rgba(var(--bs-gray-200-rgb), 0.33);
`