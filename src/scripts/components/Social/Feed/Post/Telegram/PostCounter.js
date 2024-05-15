import React from 'react'

import { PostComments } from 'scripts/components/Social/Feed/Post/PostComments'
import { PostReactions } from 'scripts/components/Social/Feed/Post/Telegram/PostCounter/PostReactions'
import { PostBookmark } from 'scripts/components/Social/Feed/Post/PostBookmark'

/**
 * @param {FormattedPost} post
 * @param interactive
 * @param {Object} props
 * @return {JSX.Element}
 * @constructor
 */
export function PostCounter ({ post, interactive = true, ...props }) {
  return <div className='flexed'>
    {
      post.comments > 0 && <>
        <PostBookmark post={post} />
        <PostComments
          disabled={!interactive}
          post={post}
        />
      </>
    }
    <PostReactions post={post} {...props} />
  </div>
}