import React from 'react'

export function PostCounter ({ post }) {
  return <span className='text-pastel-gray-500 fs-7'>
    <i className='bi bi-heart me-1' />
    { post.likes ?? 0 }
  </span>
}