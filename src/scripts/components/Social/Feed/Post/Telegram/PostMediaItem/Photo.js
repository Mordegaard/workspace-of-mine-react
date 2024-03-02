import React, { useEffect, useState } from 'react'

import { useContextLoader } from 'scripts/methods/hooks'
import { TelegramManager } from 'scripts/methods/telegram'
import { Placeholder } from 'scripts/components/ui/Placeholder'

/**
 * @param {PostMedia} media
 * @return {JSX.Element|null}
 * @constructor
 */
export function Photo ({ media }) {
  const { isLoading, throughLoading } = useContextLoader()

  const [ url, setUrl ] = useState(media.data.photo?.webpage?.displayUrl ?? '')

  const fetchMedia = () => {
    return throughLoading(async () => {
      try {
        const url = await TelegramManager.getMedia(
          media.data,
          media.type,
          {},
        )

        setUrl(url)
      } catch (e) {
        console.error(e)
      }
    })
  }

  useEffect(() => {
    if (!url) fetchMedia()
  }, [])

  if (isLoading()) {
    return <Placeholder />
  }

  return <a href={url} target='_blank' rel='noreferrer'>
    <img src={url} alt='Post image' loading='lazy' />
  </a>
}