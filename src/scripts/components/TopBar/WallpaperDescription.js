import React, { useState } from 'react'

import { useCustomEvent } from 'scripts/methods/hooks'
import { SocialController } from 'scripts/methods/social'

export function WallpaperDescription () {
  const [ post, setPost ] = useState(null)

  useCustomEvent('wallpaper:loaded', ({ detail }) => setPost(detail))

  if (post == null) return null

  return <a
    href={`${SocialController.posts.reddit.url}${post.permalink}`}
    target='_blank'
    rel='noreferrer'
    className='link-white link-opacity-50 link-opacity-75-hover fs-7'
  >
    { post.title }
  </a>
}