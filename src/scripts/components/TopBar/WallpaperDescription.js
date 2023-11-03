import React, { useState } from 'react'

import styled from 'styled-components'

import { useCustomEvent } from 'scripts/methods/hooks'

export function WallpaperDescription () {
  const [ photo, setPhoto ] = useState(null)

  useCustomEvent('wallpaper:loaded', ({ detail }) => setPhoto(detail))

  if (photo == null) return null

  return <Anchor
    href={photo.url}
    target='_blank'
    rel='noreferrer'
    className='link-white link-opacity-75 link-opacity-100-hover fs-7'
  >
    { photo.alt } [by { photo.photographer }]
  </Anchor>
}

const Anchor = styled('a')`
  text-shadow: 1px 1px 6px #00000080;
`