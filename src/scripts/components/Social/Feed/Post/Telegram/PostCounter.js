import React from 'react'

import { PostComments } from 'scripts/components/Social/Feed/Post/PostComments'
import { PostReactions } from 'scripts/components/Social/Feed/Post/Telegram/PostCounter/PostReactions'

/**
 * @param {FormattedPost} post
 * @param interactive
 * @param {Object} props
 * @return {JSX.Element}
 * @constructor
 */
export function PostCounter ({ post, interactive = true, ...props }) {
  return <div className='flexed'>
    <PostComments
      disabled={!interactive || post.comments === 0}
      post={post}
    />
    <PostReactions post={post} {...props} />
  </div>
}