import React from 'react'

import { SOURCE_REDDIT, SOURCE_TELEGRAM, SOURCE_TUMBLR } from 'scripts/methods/social/constants'
import { PostContent as RedditPostContent } from 'scripts/components/Social/Feed/Post/Reddit/PostContent'
import { PostContent as TelegramPostContent } from 'scripts/components/Social/Feed/Post/Telegram/PostContent'

export function PostContent ({ post, interactive }) {
  switch (post.type) {
    case SOURCE_REDDIT:
    case SOURCE_TUMBLR:
      return <RedditPostContent key='reddit_content' post={post} interactive={interactive} />
    case SOURCE_TELEGRAM:
      return <TelegramPostContent key='telegram_content' post={post} interactive={interactive} />
    default:
      return null
  }
}