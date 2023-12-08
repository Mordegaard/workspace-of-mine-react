import React, { useEffect, useState } from 'react'

import { useContextLoader } from 'scripts/methods/hooks'
import { TelegramManager } from 'scripts/methods/telegram'
import { Placeholder } from 'scripts/components/ui/Placeholder'

/**
 * @param {PostMedia} media
 * @return {JSX.Element|null}
 * @constructor
 */
export function Video ({ media }) {
  const { isLoading, throughLoading } = useContextLoader()

  const [ url, setUrl ]           = useState(media.data.photo?.webpage?.displayUrl ?? '')
  const [ thumbUrl, setThumbUrl ] = useState('')
  const [ progress, setProgress ] = useState(0)

  const fetchMedia = () => {
    return throughLoading(async () => {
      try {
        const url = await TelegramManager.getMedia(
          media.data,
          media.type,
          {},
          (progress, total) => setProgress(Math.round(progress / total * 100))
        )

        setUrl(url)
      } catch (e) {
        console.error(e)
      }
    })
  }

  const fetchThumb = async () => {
    const thumbnail = media.data.document.thumbs?.[0]

    if (thumbnail) {
      const thumbnailBytes = await TelegramManager.rawClient.downloads._downloadCachedPhotoSize(thumbnail)
      const blob = new Blob([ thumbnailBytes ], { type: "image/jpeg" })
      const thumbUrl = URL.createObjectURL(blob)

      setThumbUrl(thumbUrl)
    }
  }

  useEffect(() => {
    if (!url) fetchThumb()
  }, [])

  if (isLoading()) {
    return <Placeholder className='flexed'>
      <button disabled className='btn btn-outline-white btn-pill bg-gray-800' style={{ '--bs-bg-opacity': 0.334 }}>
        { progress }%
      </button>
    </Placeholder>
  }

  if (!url) {
    return <Placeholder $thumbUrl={thumbUrl} className='flexed'>
      <button className='btn btn-outline-white btn-pill' onClick={fetchMedia}>
        <i className='bi bi-play-btn me-2 lh-0' />
        Завантажити
      </button>
    </Placeholder>
  }

  return <video loop controls autoPlay width='100%' poster='data:image/gif,AAAA'>
    <source src={url} type={media.data.document.mimeType} />
  </video>
}