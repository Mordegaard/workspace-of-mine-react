import React, { useEffect, useState } from 'react'

import CacheManager from 'scripts/methods/cache'
import { TelegramManager } from 'scripts/methods/telegram'
import { MEDIA_PHOTO, MEDIA_VIDEO } from 'scripts/methods/social/constants'
import { useContextLoader } from 'scripts/methods/hooks'
import { Placeholder } from 'scripts/components/ui/Placeholder'
import NotificationManager from 'scripts/methods/notificationManager'

/**
 * @param {PostMedia} media
 * @return {JSX.Element|null}
 * @constructor
 */
export function PostMediaItem ({ media }) {
  const { isLoading, throughLoading } = useContextLoader()

  const [ thumbUrl, setThumbUrl ] = useState('')
  const [ url, setUrl ] = useState('')
  const [ progress, setProgress ] = useState(0)

  const displayUrl = media.data.photo?.webpage?.displayUrl

  const fetchMedia = () => {
    return throughLoading(async () => {
      try {
        if (typeof displayUrl === 'string') {
          setUrl(displayUrl)
        } else {
          const id = String(media.data?.photo?.id ?? media.data?.document?.id)
          let blob = await CacheManager.get(`media/telegram/${id}`, 'blob')

          if (!blob) {
            blob = await TelegramManager.getMedia(
              media.data,
              media.type,
              {},
              (progress, total) => setProgress(Math.round(progress / total * 100))
            )

            await CacheManager.put(`media/telegram/${id}`, blob)
          }

          setUrl(URL.createObjectURL(blob))
        }
      } catch (e) {
        console.error(e)
        NotificationManager.notify('Не вдалося завантажити медіа', NotificationManager.TYPE_ERROR)
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

  const renderUnloaded = () => {
    switch (media.type) {
      case MEDIA_VIDEO:
        return <Placeholder $thumbUrl={thumbUrl} className='flexed'>
          <button className='btn btn-outline-white btn-pill' onClick={fetchMedia}>
            <i className='bi bi-play-btn me-2 lh-0' />
            Завантажити
          </button>
        </Placeholder>
      default:
        return null
    }
  }

  const renderLoaded = () => {
    switch (media.type) {
      case MEDIA_VIDEO:
        return <video loop controls autoPlay width='100%' poster='data:image/gif,AAAA'>
          <source src={url} type={media.data.document.mimeType} />
        </video>
      case MEDIA_PHOTO:
        return <a href={url} target='_blank' rel='noreferrer'>
          <img src={url} alt='Post image' />
        </a>
      default:
        return null
    }
  }

  useEffect(() => {
    if (!displayUrl && media.type === MEDIA_VIDEO) {
      fetchThumb()
    }

    if (media.type === MEDIA_PHOTO) {
      fetchMedia()
    }
  }, [])

  if (isLoading()) {
    return <Placeholder className='flexed'>
      <button disabled className='btn btn-outline-white btn-pill bg-gray-800' style={{ '--bs-bg-opacity': 0.334 }}>
        { progress }%
      </button>
    </Placeholder>
  }

  if (!url) {
    return renderUnloaded()
  }

  return renderLoaded()
}