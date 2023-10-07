import React from 'react'

import { MEDIA_EMBED, MEDIA_PHOTO } from 'scripts/methods/social/constants'
import { Photo } from 'scripts/components/Social/Feed/Post/Reddit/PostMediaItem/Photo'
import { Embed } from 'scripts/components/Social/Feed/Post/Reddit/PostMediaItem/Embed'

/**
 * @param {PostMedia} media
 * @param {boolean} interactive
 * @return {JSX.Element}
 * @constructor
 */
export function PostMediaItem ({ media, interactive }) {
  return TYPE_MAPPING[media.type] && React.createElement(
    TYPE_MAPPING[media.type],
    { media, interactive }
  )
}

const TYPE_MAPPING = {
  [MEDIA_PHOTO]: Photo,
  [MEDIA_EMBED]: Embed
}