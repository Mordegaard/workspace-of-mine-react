import React, { useEffect, useState } from 'react'

import styled from 'styled-components'

import { useContextLoader } from 'scripts/methods/hooks'
import { TelegramManager } from 'scripts/methods/telegram'
import { Placeholder } from 'scripts/components/ui/Placeholder'
import { formatSize, formatTime } from 'scripts/methods/helpers'
import { blurImage } from 'scripts/methods/blurImage'

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

  const duration = media.data.document.attributes.find(({ className }) => className === 'DocumentAttributeVideo')?.duration
  const size     = media.data.document.size

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
      const blurredUrl = await blurImage(thumbUrl, { scale: 10 })

      setThumbUrl(blurredUrl)

      URL.revokeObjectURL(thumbUrl)

      return blurredUrl
    }
  }

  useEffect(() => {
    let url = ''

    if (!url) {
      fetchThumb().then(thumbUrl => url = thumbUrl)
    }

    return () => {
      URL.revokeObjectURL(url)
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
    return <Placeholder thumbUrl={thumbUrl} className='flexed' onClick={fetchMedia}>
      <Badge>
        {
          [duration && formatTime(duration), size && formatSize(size)].filter(Boolean).join(' / ')
        }
      </Badge>
      <GlassButton className='position-relative'>
        <i className='bi bi-play-btn me-2 lh-0' />
        Завантажити
      </GlassButton>
    </Placeholder>
  }

  return <video loop controls autoPlay width='100%' poster='data:image/gif,AAAA'>
    <source src={url} type={media.data.document.mimeType} />
  </video>
}

const GlassButton = styled('button').attrs({ className: 'btn btn-outline-white btn-pill' })`
  z-index: 1;
`

const Badge = styled(GlassButton).attrs(({ className: 'px-2 py-0' }))`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 0.66rem;
`