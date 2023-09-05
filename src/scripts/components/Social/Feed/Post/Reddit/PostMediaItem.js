import React from 'react'

export function PostMediaItem ({ media }) {
  return <a href={media.fullSizeUrl ?? media.url} target='_blank' rel='noreferrer'>
    <img src={media.url} alt='Post image' />
  </a>
}