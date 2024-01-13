import React from 'react'

import { MEDIA_IMAGE, MEDIA_VIDEO } from 'scripts/methods/social/constants'
import { Photo } from 'scripts/components/Social/Feed/Post/Telegram/PostMediaItem/Photo'
import { Video } from 'scripts/components/Social/Feed/Post/Telegram/PostMediaItem/Video'

/**
 * @param {PostMedia} media
 * @return {JSX.Element|null}
 * @constructor
 */
export function PostMediaItem ({ media }) {
  return COMPONENTS_MAPPING[media.type] && React.createElement(COMPONENTS_MAPPING[media.type], { media })
}

const COMPONENTS_MAPPING = {
  [MEDIA_IMAGE]: Photo,
  [MEDIA_VIDEO]: Video
}