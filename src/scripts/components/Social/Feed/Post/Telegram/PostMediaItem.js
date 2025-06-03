/* global telegram */

import React from 'react'

import styled from 'styled-components'

import { MEDIA_IMAGE, MEDIA_VIDEO } from 'scripts/methods/social/constants'
import { Photo } from 'scripts/components/Social/Feed/Post/Telegram/PostMediaItem/Photo'
import { Video } from 'scripts/components/Social/Feed/Post/Telegram/PostMediaItem/Video'
import { GlassButton } from 'scripts/components/ui/Helpers/Components'
import { TelegramManager } from 'scripts/methods/telegram'
import { SocialController } from 'scripts/methods/social'

/**
 * @param {FormattedPost} post
 * @param {PostMedia} media
 * @param {function} onPostChange
 * @return {JSX.Element|null}
 * @constructor
 */
export function PostMediaItem ({ media, post, onPostChange }) {
  async function fetchGroupedPost () {
    const { messages } = await TelegramManager.client.invoke(
      new telegram.Api.messages.GetHistory({
        peer: post.source.key,
        offsetId: post.id,
        addOffset: -SEARCH_RANGE,
        limit: SEARCH_RANGE * 3 + 1,
      })
    )

    const groupedPosts = SocialController.posts.telegram.groupPosts(messages)
    const foundCurrentPost = groupedPosts.find(telegramPost =>
      telegramPost.groupedId && telegramPost.groupedId.toString() === post.originalPost.groupedId.toString()
    )

    onPostChange(await SocialController.posts.telegram.formatPost(foundCurrentPost, post.source))
  }

  return <>
    {
      COMPONENTS_MAPPING[media.type] && React.createElement(COMPONENTS_MAPPING[media.type], { media })
    }
    {
      post.media.length === 1 && post.originalPost.groupedId && <AbsoluteButton
        onClick={fetchGroupedPost}
      >
        Завантажити згруповані пости
      </AbsoluteButton>
    }
  </>
}

const COMPONENTS_MAPPING = {
  [MEDIA_IMAGE]: Photo,
  [MEDIA_VIDEO]: Video
}

const SEARCH_RANGE = 3

const AbsoluteButton = styled(GlassButton).attrs({ className: 'btn-sm' })`
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%) scale(0.75);
  white-space: nowrap;
`