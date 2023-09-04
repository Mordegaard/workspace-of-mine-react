import React, { useEffect, useState } from 'react'

import CacheManager from 'scripts/methods/cache'
import { TelegramManager } from 'scripts/methods/telegram'
import { SocialController } from 'scripts/methods/social'

export function PostImage ({ image }) {
  const [ url, setUrl ] = useState('')

  const fetchImage = async () => {
    if (typeof image.url === 'string') {
      setUrl(image.url)
    } else {
      let blob = await CacheManager.get(`images/telegram/${image.url.id.toString()}`, 'blob')

      if (!blob) {
        blob = await TelegramManager.getPhoto(image.url)
        await CacheManager.put(`images/telegram/${image.url.id.toString()}`, blob, SocialController.posts.cacheTTL)
      }

      setUrl(URL.createObjectURL(blob))
    }
  }

  useEffect(() => {
    fetchImage()
  }, [])

  if (!url) return null

  return <a href={url} target='_blank' rel='noreferrer'>
    <img src={url} alt='Post image' />
  </a>
}