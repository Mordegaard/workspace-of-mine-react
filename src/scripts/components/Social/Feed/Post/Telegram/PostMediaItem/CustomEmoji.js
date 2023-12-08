import React, { useEffect, useState } from 'react'

import { TelegramManager } from 'scripts/methods/telegram'

export function CustomEmoji ({ document, originalEmoji }) {
  const [ url, setUrl ] = useState('')

  const fetchEmoji = async () => {
    try {
      const url = await TelegramManager.downloadDocument(document)
      console.log(url)

      setUrl(url)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchEmoji()
  }, [])

  return url
    ? <img src={url} alt={originalEmoji} />
    : originalEmoji
}