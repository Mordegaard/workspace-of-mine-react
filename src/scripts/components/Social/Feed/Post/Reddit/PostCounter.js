import React from 'react'
import { PostComments } from 'scripts/components/Social/Feed/Post/PostComments'
import { mergeClasses } from 'scripts/methods/helpers'

/**
 * @param {FormattedPost} post
 * @param {boolean} interactive
 * @return {JSX.Element}
 * @constructor
 */
export function PostCounter ({ post, interactive = true }) {
  return <span>
    <PostComments
      disabled={!interactive}
      post={post}
      trigger={
        <span
          className={
            mergeClasses(interactive ? 'btn btn-sm btn-pill btn-basic-primary me-1' : 'text-gray-500 me-2', 'fs-7')
          }
        >
          <i className='bi bi-chat-dots me-1' />
          { post.comments ?? 0 }
        </span>
      }
    />
    <span className='text-gray-500 fs-7'>
      <i className='bi bi-heart me-1' />
      { post.likes ?? 0 }
    </span>
  </span>
}