import React, { useEffect, useState } from 'react'

import styled, { css, keyframes } from 'styled-components'

import CacheManager from 'scripts/methods/cache'
import { TelegramManager } from 'scripts/methods/telegram'
import { SocialController } from 'scripts/methods/social'
import { MEDIA_PHOTO, MEDIA_VIDEO } from 'scripts/methods/social/constants'
import { useContextLoader } from 'scripts/methods/hooks'

/**
 * @param {PostMedia} media
 * @return {JSX.Element|null}
 * @constructor
 */
export function PostMediaItem ({ media }) {
  const { isLoading, throughLoading } = useContextLoader()

  const [ thumbUrl, setThumbUrl ] = useState('')
  const [ url, setUrl ] = useState('')

  const fetchMedia = () => {
    return throughLoading(async () => {
      if (typeof media.fullSizeUrl === 'string') {
        setUrl(media.fullSizeUrl)
      } else {
        const id = String(media.url?.photo?.id ?? media.url?.document?.id)
        let blob = await CacheManager.get(`media/telegram/${id}`, 'blob')

        if (!blob) {
          blob = await TelegramManager.getMedia(media.url, media.type)
          await CacheManager.put(`media/telegram/${id}`, blob, SocialController.posts.cacheTTL)
        }

        setUrl(URL.createObjectURL(blob))
      }
    })
  }

  const fetchThumb = async () => {
    const thumbnail = media.url.document.thumbs?.[0]

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
          <button className='btn btn-primary btn-pill' onClick={fetchMedia}>
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
        return <video controls autoPlay width='100%' poster='data:image/gif,AAAA'>
          <source src={url} type={media.url.document.mimeType} />
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
    if (!media.fullSizeUrl && media.type === MEDIA_VIDEO) {
      fetchThumb()
    }

    if (media.type === MEDIA_PHOTO) {
      fetchMedia()
    }
  }, [])

  if (isLoading()) {
    return <Placeholder className='flexed' />
  }

  if (!url) {
    return renderUnloaded()
  }

  return renderLoaded()
}

const fading = keyframes`
  0%   { background: var(--bs-gray-200); }
  50%  { background: var(--bs-gray-100); }
  100% { background: var(--bs-gray-200); }
`

const fadingAnimation = css`animation: ${ fading } 1s linear infinite;`

const Placeholder = styled('div').attrs(({ $thumbUrl }) => ({
  style: $thumbUrl
    ? { background: `0 0 / 100% url("${ $thumbUrl }")` }
    : {}
}))`
  background: var(--bs-gray-200);
  min-width: 100%;
  height: 100%;
  
  ${({ $thumbUrl }) => !$thumbUrl && fadingAnimation}
`