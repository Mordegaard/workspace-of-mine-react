import React from 'react'

/**
 * @param {PostMedia} media
 * @return {JSX.Element}
 * @constructor
 */
export function PostMediaItem ({ media }) {
  return <a href={media.data.url ?? media.data.thumbnail} target='_blank' rel='noreferrer'>
    <img src={media.data.thumbnail} alt='Post image' />
  </a>
}