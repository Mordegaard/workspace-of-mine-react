import React from 'react'

export function PostImage ({ image }) {
  return <a href={image.fullSizeUrl ?? image.url} target='_blank' rel='noreferrer'>
    <img src={image.url} alt='Post image' />
  </a>
}