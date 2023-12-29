import React from 'react'

import { PostComments } from 'scripts/components/Social/Feed/Post/PostComments'

/**
 * @param {FormattedPost} post
 * @param {boolean} interactive
 * @return {JSX.Element}
 * @constructor
 */
export function PostCounter ({ post, interactive = true }) {
  return <div>
    <PostComments
      disabled={!interactive || post.comments === 0}
      post={post}
    />
    <span className='text-gray-600 fs-7'>
      <i className='bi bi-heart me-1' />
      { post.likes ?? 0 }
    </span>
  </div>
}