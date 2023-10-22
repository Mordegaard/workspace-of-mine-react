import React, { useState } from 'react'

import styled from 'styled-components'

import { useCustomEvent } from 'scripts/methods/hooks'
import { SocialController } from 'scripts/methods/social'

export function WallpaperDescription () {
  const [ post, setPost ] = useState(null)

  useCustomEvent('wallpaper:loaded', ({ detail }) => setPost(detail))

  if (post == null) return null

  return <Anchor
    href={`${SocialController.posts.reddit.url}${post.permalink}`}
    target='_blank'
    rel='noreferrer'
    className='link-white link-opacity-75 link-opacity-100-hover fs-7'
  >
    { post.title }
  </Anchor>
}

const Anchor = styled('a')`
  text-shadow: 1px 1px 6px #00000080;
`