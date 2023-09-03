import React from 'react'

import { format, isSameDay } from 'date-fns'
import { uk as locale } from 'date-fns/locale'

import styled from 'styled-components'

import { Anchor } from 'scripts/components/ui/Anchor'
import { Images } from 'scripts/components/Social/Feed/Post/Images'
import { SocialIcon } from 'scripts/components/ui/SocialIcon'
import { mergeClasses } from 'scripts/methods/helpers'
import { SOURCE_REDDIT, SOURCE_TELEGRAM } from 'scripts/methods/social/constants'
import { PostContent as RedditPostContent } from 'scripts/components/Social/Feed/Post/Reddit/PostContent'
import { PostContent as TelegramPostContent } from 'scripts/components/Social/Feed/Post/Telegram/PostContent'

/**
 *
 * @param {FormattedPost} post
 * @return {JSX.Element}
 * @constructor
 */
export function PostBase ({ post }) {
  const createdAt = new Date(post.createdAt)

  const renderPostContent = () => {
    switch (post.type) {
      case SOURCE_REDDIT:
        return <RedditPostContent key='reddit_content' post={post} />
      case SOURCE_TELEGRAM:
        return <TelegramPostContent key='telegram_content' post={post} />
    }
  }

  return <Container>
    <div className='row px-3 py-2'>
      {
        post.links.map((link, index) =>
          <Anchor
            key={index}
            href={link.url}
            className={
              mergeClasses(
                'flexed',
                `col-${12 / post.links.length}`,
                index === 0 && 'justify-content-start',
                index === post.links.length - 1 && 'justify-content-end'
              )
            }
            $color='var(--bs-pastel-gray-500)'
          >
            { LINK_ICONS[link.type]?.(post) }
            <span className='text-truncate'>
              { link.name }
            </span>
          </Anchor>
        )
      }
    </div>
    {
      Array.isArray(post.images)
      && post.images.length > 0
      && <Images images={post.images} />
    }
    <div className='px-3 py-2'>
      { renderPostContent() }
    </div>
    <div className='d-flex justify-content-between px-3 py-2'>
      <span className='text-pastel-gray-500 fs-7' title={format(createdAt, FORMAT_FULL, { locale })}>
        <i className='bi bi-clock me-1' onClick={() => console.log(post)} />
        {
          format(
            createdAt,
            isSameDay(createdAt, new Date) ? FORMAT_HOUR : FORMAT_HOURLESS,
            { locale }
          )
        }
      </span>
      {
        post.likes != null && <span className='text-pastel-gray-500 fs-7'>
          <i className='bi bi-heart me-1' />
          { post.likes }
        </span>
      }
    </div>
  </Container>
}

export const Post =  React.memo(PostBase)

export const FORMAT_FULL     = 'HH:mm dd MMM yyyy'
export const FORMAT_HOUR     = 'HH:mm'
export const FORMAT_HOURLESS = 'dd MMM yyyy'

const LINK_ICONS = {
  source: (post) => <div className='me-1'><SocialIcon type={post.type} /></div>,
  user: () => <i className='bi bi-person me-1 lh-0' />
}

const Container = styled('div')`
  background: var(--bs-pastel-gray-100);
  border-radius: 16px;
  margin: 1.5rem 0;
  box-shadow: -1px 1px 18px -10px black;
`