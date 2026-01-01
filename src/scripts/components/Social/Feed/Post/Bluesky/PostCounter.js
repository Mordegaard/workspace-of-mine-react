import React from 'react'

import { PostBookmark } from 'scripts/components/Social/Feed/Post/PostBookmark'

/**
 * @param {FormattedPost} post
 * @param {boolean} interactive
 * @param {Object} props
 * @return {JSX.Element}
 * @constructor
 */
export function PostCounter ({ post, interactive = true, ...props }) {
  return <div className='flexed'>
    {
      post.source && <PostBookmark post={post} />
    }
    <span {...props}>
      <i className='bi bi-heart me-1' />
      { post.likes ?? 0 }
    </span>
  </div>
}