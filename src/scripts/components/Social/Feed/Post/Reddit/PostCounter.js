import React from 'react'

import { PostComments } from 'scripts/components/Social/Feed/Post/PostComments'
import { PostBookmark } from 'scripts/components/Social/Feed/Post/PostBookmark'

/**
 * @param {FormattedPost} post
 * @param {boolean} interactive
 * @param {Object} props
 * @return {JSX.Element}
 * @constructor
 */
export function PostCounter ({ post, interactive = true, ...props }) {
  return <div>
    <PostBookmark post={post} />
    <PostComments
      disabled={!interactive || post.comments === 0}
      post={post}
    />
    <span  {...props}>
      <i className='bi bi-heart me-1' />
      { post.likes ?? 0 }
    </span>
  </div>
}