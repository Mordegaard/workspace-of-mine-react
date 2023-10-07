import React, { useEffect, useRef, useState } from 'react'

import styled, { css } from 'styled-components'

import { SOURCE_REDDIT, SOURCE_TELEGRAM } from 'scripts/methods/social/constants'
import { PostMediaItem as RedditPostMediaItem } from 'scripts/components/Social/Feed/Post/Reddit/PostMediaItem'
import { PostMediaItem as TelegramPostMediaItem } from 'scripts/components/Social/Feed/Post/Telegram/PostMediaItem'

/**
 * @param {PostMedia[]} media
 * @param {SourceType} type
 * @param {boolean} interactive
 * @return {JSX.Element}
 * @constructor
 */
export function Media ({ media = [], type, interactive }) {
  const [ index, setIndex ] = useState(0)

  const ref = useRef()

  const renderPostMediaItem = (media) => {
    switch (type) {
      case SOURCE_REDDIT:
        return <RedditPostMediaItem media={media} interactive={interactive} />
      case SOURCE_TELEGRAM:
        return <TelegramPostMediaItem media={media} interactive={interactive} />
    }
  }

  useEffect(() => {
    ref.current.scrollLeft = index * ref.current.offsetWidth
  }, [ index ])

  return <div className='position-relative'>
    <Container
      ref={ref}
      className='d-flex'
      $media={media[index]}
      $interactive={interactive}
    >
      {
        media.map((item, index) => <React.Fragment key={index}>
            { renderPostMediaItem(item) }
          </React.Fragment>
        )
      }
    </Container>
    {
      index > 0 && <LeftButton className='flexed' onClick={() => setIndex(index - 1)}>
        <i className='bi bi-chevron-left fs-7 lh-0' />
      </LeftButton>
    }
    {
      index < media.length - 1 && <RightButton className='flexed' onClick={() => setIndex(index + 1)}>
        <i className='bi bi-chevron-right fs-7 lh-0' />
      </RightButton>
    }
  </div>
}

const Container = styled('div').attrs(({ $media, $interactive }) => ({
  style: {
    aspectRatio: `${$media.width} / ${$media.height}`,
    borderRadius: !$interactive ? 18: ''
  }
}))`
  position: relative;
  width: 100%;
  overflow: hidden;
  transition: aspect-ratio 0.35s ease;
  scroll-behavior: smooth;
  
  a {
    min-width: 100%;
  }
  
  img {
    width: 100%;
  }
`

const buttonStyles = css`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bs-gray-100);
  border: none;
  box-shadow: -1px 1px 16px -6px black;
  color: var(--bs-primary);
`

const LeftButton = styled('button')`
  ${buttonStyles};
  left: 8px;
`

const RightButton = styled('button')`
  ${buttonStyles};
  right: 8px;
`