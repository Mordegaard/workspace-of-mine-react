import React from 'react'

import { format, isSameDay } from 'date-fns'
import locale from 'date-fns/locale/uk'

import styled, { css } from 'styled-components'

import { Anchor } from 'scripts/components/ui/Anchor'
import { PostMedia } from 'scripts/components/Social/Feed/Post/PostMedia'
import { SocialIcon } from 'scripts/components/ui/SocialIcon'
import { mergeClasses } from 'scripts/methods/helpers'
import { PostContent } from 'scripts/components/Social/Feed/Post/PostContent'
import { PostCounter } from 'scripts/components/Social/Feed/Post/PostCounter'
import { SocialController } from 'scripts/methods/social'

/**
 *
 * @param {FormattedPost} post
 * @param {boolean} interactive
 * @return {JSX.Element}
 * @constructor
 */
export function PostBase ({ post, interactive = true }) {
  const createdAt = new Date(post.createdAt)

  return <Container $simple={!interactive} id={SocialController.posts.getPostId(post)}>
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
        <PostMedia interactive={interactive} post={post} />
      </div>
    }
    <PostContent post={post} interactive={interactive} />
    <div className='d-flex flex-wrap justify-content-between align-items-center px-3 py-2 fs-7'>
      <div className='text-gray-600 text-truncate' title={format(createdAt, FORMAT_FULL, { locale })}>
        <i className='bi bi-clock me-1' onClick={() => console.log(post)} />
        {
          format(
            createdAt,
            isSameDay(createdAt, new Date) ? FORMAT_HOUR : FORMAT_HOURLESS,
            { locale }
          )
        }
      </div>
      <PostCounter post={post} interactive={interactive} className='text-gray-500' />
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
            margin-bottom: 1.5rem;
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