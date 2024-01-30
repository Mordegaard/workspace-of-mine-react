import React, { useEffect, useState } from 'react'

import styled, { css } from 'styled-components'

import { TelegramManager } from 'scripts/methods/telegram'

export function CustomEmoji ({ document, originalEmoji }) {
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
    ? <VideoEmoji title={originalEmoji} autoPlay loop>
        <source src={url} type={document.mimeType} />
      </VideoEmoji>
    : <PhotoEmoji src={url} alt={originalEmoji} title={originalEmoji} />
}

const styles = css`
  display: inline-block;
  width: 24px;
  height: 24px;
`

const PhotoEmoji = styled('img')`
  ${styles};
`

const VideoEmoji = styled('video')`
  ${styles};
`