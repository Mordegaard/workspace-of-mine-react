import React from 'react'

import { SOURCE_REDDIT, SOURCE_TELEGRAM, SOURCE_TUMBLR } from 'scripts/methods/social/constants'
import { PostCounter as RedditPostCounter } from 'scripts/components/Social/Feed/Post/Reddit/PostCounter'
import { PostCounter as TelegramPostCounter } from 'scripts/components/Social/Feed/Post/Telegram/PostCounter'
import { PostCounter as TumblrPostCounter } from 'scripts/components/Social/Feed/Post/Tumblr/PostCounter'

export function PostCounter ({ post, interactive, ...props }) {
  switch (post.type) {
    case SOURCE_REDDIT:
      return <RedditPostCounter key='reddit_post_counter' post={post} interactive={interactive} {...props} />
    case SOURCE_TELEGRAM:
      return <TelegramPostCounter key='telegram_post_counter' post={post} interactive={interactive} {...props} />
    case SOURCE_TUMBLR:
      return <TumblrPostCounter key='tumblr_post_counter' post={post} interactive={interactive} {...props} />
    default:
      return null
  }
}