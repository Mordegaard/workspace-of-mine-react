import React from 'react'

import { format, isSameDay } from 'date-fns'
import locale from 'date-fns/locale/uk'

import styled, { css } from 'styled-components'

import { Anchor } from 'scripts/components/ui/Anchor'
import { Media } from 'scripts/components/Social/Feed/Post/Media'
import { SocialIcon } from 'scripts/components/ui/SocialIcon'
import { mergeClasses } from 'scripts/methods/helpers'
import { SOURCE_REDDIT, SOURCE_TELEGRAM } from 'scripts/methods/social/constants'
import { PostContent as RedditPostContent } from 'scripts/components/Social/Feed/Post/Reddit/PostContent'
import { PostContent as TelegramPostContent } from 'scripts/components/Social/Feed/Post/Telegram/PostContent'
import { PostCounter as RedditPostCounter } from 'scripts/components/Social/Feed/Post/Reddit/PostCounter'
import { PostCounter as TelegramPostCounter } from 'scripts/components/Social/Feed/Post/Telegram/PostCounter'

/**
 *
 * @param {FormattedPost} post
 * @param {boolean} interactive
 * @return {JSX.Element}
 * @constructor
 */
export function PostBase ({ post, interactive = true }) {
  const createdAt = new Date(post.createdAt)

  const renderPostContent = () => {
    switch (post.type) {
      case SOURCE_REDDIT:
        return <RedditPostContent key='reddit_content' post={post} interactive={interactive} />
      case SOURCE_TELEGRAM:
        return <TelegramPostContent key='telegram_content' post={post} interactive={interactive} />
      default:
        return null
    }
  }

  const renderPostCounter = () => {
    switch (post.type) {
      case SOURCE_REDDIT:
        return <RedditPostCounter key='reddit_post_counter' post={post} interactive={interactive} />
      case SOURCE_TELEGRAM:
        return <TelegramPostCounter key='telegram_post_counter' post={post} interactive={interactive} />
    }
  }

  return <Container $simple={!interactive}>
    <div className='row px-3 py-2'>
      {
        post.links?.map((link, index) =>
          <StyledAnchor
            key={index}
            href={link.url}
            className={
              mergeClasses(
                'flexed',
                `col-${12 / post.links.length}`,
              )
            }
            $color='var(--bs-gray-500)'
          >
            { LINK_ICONS[link.type]?.(post) }
            <span className='text-truncate'>
              { link.name }
            </span>
          </StyledAnchor>
        )
      }
    </div>
    {
      Array.isArray(post.media)
      && post.media.length > 0
      && <div className={mergeClasses(!interactive && 'px-3')}>
        <Media media={post.media} type={post.type} interactive={interactive} />
      </div>
    }
    <div className='px-3 py-2'>
      { renderPostContent() }
    </div>
    <div className='d-flex justify-content-between align-items-center px-3 py-2'>
      <span className='text-gray-500 fs-7' title={format(createdAt, FORMAT_FULL, { locale })}>
        <i className='bi bi-clock me-1' onClick={() => console.log(post)} />
        {
          format(
            createdAt,
            isSameDay(createdAt, new Date) ? FORMAT_HOUR : FORMAT_HOURLESS,
            { locale }
          )
        }
      </span>
      { renderPostCounter() }
    </div>
  </Container>
}

export const Post =  React.memo(PostBase)

export const FORMAT_FULL     = 'HH:mm, dd MMM yyyy'
export const FORMAT_HOUR     = 'HH:mm'
export const FORMAT_HOURLESS = 'dd MMM yyyy'

const LINK_ICONS = {
  source: (post) => <div className='me-1'><SocialIcon type={post.type} /></div>,
  user: () => <i className='bi bi-person me-1 lh-0' />
}

const Container = styled('div')`
  ${({ $simple }) => $simple
          ? css`
            max-width: 768px;
          `
          : css`
            background: var(--bs-gray-100);
            border-radius: 16px;
            margin: 1.5rem 0;
            box-shadow: -1px 1px 18px -10px black;
          `
  }
`

const StyledAnchor = styled(Anchor)`
  &:last-child {
    justify-content: end;
  }
  
  &:first-child {
    justify-content: start;
  }
`