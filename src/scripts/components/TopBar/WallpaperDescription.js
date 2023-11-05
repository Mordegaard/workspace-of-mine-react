import React, { useState } from 'react'

import styled from 'styled-components'

import { useCustomEvent } from 'scripts/methods/hooks'
import { SlicedText } from 'scripts/components/ui/SlicedText'

import PexelsIcon from 'assets/icons/pexels.svg'

export function WallpaperDescription () {
  const [ photo, setPhoto ] = useState(null)

  useCustomEvent('wallpaper:loaded', ({ detail }) => setPhoto(detail))

  if (photo == null) return null

  return <Anchor
    href={photo.url}
    target='_blank'
    rel='noreferrer'
    className='link-white fs-7'
  >
    <PexelsIcon className='me-2' />
    <SlicedText limit={64}>
      { photo.alt }
    </SlicedText>
    &nbsp;[by { photo.photographer }]
  </Anchor>
}

const Anchor = styled('a')`
  border-radius: 666px;
  padding: 4px 12px;
  filter: drop-shadow(1px 1px 6px #00000080);
  
  &:hover {
    filter: none;
    background: var(--bs-pexels);
  }
`