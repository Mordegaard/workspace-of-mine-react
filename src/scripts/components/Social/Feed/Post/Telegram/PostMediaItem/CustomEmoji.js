import React, { useEffect, useState } from 'react'

import styled, { css } from 'styled-components'

import { TelegramManager } from 'scripts/methods/telegram'

export function CustomEmoji ({ document, originalEmoji, size = 24 }) {
  const [ url, setUrl ] = useState('')

  const fallback = originalEmoji != null
    ? originalEmoji + '\uFE0F'
    : '???'

  const fetchEmoji = async () => {
    try {
      const url = await TelegramManager.downloadDocument(document)

      setUrl(url)

      return url
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    let emojiUrl = ''

    fetchEmoji().then(url => emojiUrl = url)

    return () => {
      URL.revokeObjectURL(emojiUrl)
    }
  }, [])

  if (!url) {
    return fallback
  }

  return document.mimeType.includes('video')
    ? <VideoEmoji title={fallback} autoPlay loop $size={size}>
        <source src={url} type={document.mimeType} />
      </VideoEmoji>
    : <PhotoEmoji src={url} alt={fallback} title={fallback} $size={size} />
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