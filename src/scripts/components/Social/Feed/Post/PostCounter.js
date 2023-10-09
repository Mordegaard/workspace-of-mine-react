import React from 'react'

import { SOURCE_REDDIT, SOURCE_TELEGRAM } from 'scripts/methods/social/constants'
import { PostCounter as RedditPostCounter } from 'scripts/components/Social/Feed/Post/Reddit/PostCounter'
import { PostCounter as TelegramPostCounter } from 'scripts/components/Social/Feed/Post/Telegram/PostCounter'

export function PostCounter ({ post, interactive }) {
  switch (post.type) {
    case SOURCE_REDDIT:
      return <RedditPostCounter key='reddit_post_counter' post={post} interactive={interactive} />
    case SOURCE_TELEGRAM:
      return <TelegramPostCounter key='telegram_post_counter' post={post} interactive={interactive} />
    default:
      return null
  }
}