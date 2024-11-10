import React from 'react'

export function PostContent ({ post }) {
  return post.text && <div className='px-3 py-2'>{ post.text }</div>
}