import React from 'react'

export function PostCounter ({ post }) {
  const totalCount = post.reactions?.reduce((acc, value) => acc + value.count, 0) ?? 0

  return <span className='text-gray-500 fs-7'>
    <i className='bi bi-emoji-smile me-1' />
    { totalCount }
  </span>
}