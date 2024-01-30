import React, { useEffect, useState } from 'react'

import styled, { css } from 'styled-components'

import { TelegramManager } from 'scripts/methods/telegram'

export function CustomEmoji ({ document, originalEmoji, size = 24 }) {
  const [ url, setUrl ] = useState('')

  const fetchEmoji = async () => {
    try {
      setUrl(await TelegramManager.downloadDocument(document))
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchEmoji()
  }, [])

  if (!url) {
    return originalEmoji
  }

  return document.mimeType.includes('video')
    ? <VideoEmoji title={originalEmoji} autoPlay loop $size={size}>
        <source src={url} type={document.mimeType} />
      </VideoEmoji>
    : <PhotoEmoji src={url} alt={originalEmoji} title={originalEmoji} $size={size} />
}

const styles = css`
  display: inline-block;
  vertical-align: text-top;
  
  ${({ $size }) => css`
    width: ${$size}px;
    height: ${$size}px;
  `}
`

const PhotoEmoji = styled('img')`
  ${styles};
`

const VideoEmoji = styled('video')`
  ${styles};
`