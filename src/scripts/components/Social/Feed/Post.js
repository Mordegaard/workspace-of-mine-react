import React from 'react'

import { format, isSameDay } from 'date-fns'
import { uk as locale } from 'date-fns/locale'

import styled from 'styled-components'

import { Images } from 'scripts/components/Social/Feed/Post/Images'
import { SocialIcon } from 'scripts/components/ui/SocialIcon'
import { mergeClasses } from 'scripts/methods/helpers'

/**
 *
 * @param {FormattedPost} post
 * @return {JSX.Element}
 * @constructor
 */
export function PostBase ({ post }) {
  const isTrimmed = post.title.length > TEXT_THRESHOLD
  const title = isTrimmed ? post.title.slice(0, TEXT_THRESHOLD).trim() + '...' : post.title

  const createdAt = new Date(post.createdAt)

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
      post.images.length > 0 && <Images images={post.images} />
    }
    <div className='px-3 py-2'>
      {
        <div className='h5'>
          <Anchor href={post.url}>
            { title }
          </Anchor>
        </div>
      }
      <div className='text-break'>
        {
          isTrimmed && <div>
            <b>{ post.title }</b>
          </div>
        }
        {
          post.text
        }
      </div>
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
          <i className='bi bi-heart me-1' onClick={() => console.log(post?.originalPost)} />
          { post.likes }
        </span>
      }
    </div>
  </Container>
}

export const Post =  React.memo(PostBase)

const TEXT_THRESHOLD = 42
const FORMAT_FULL     = 'HH:mm dd MMM yyyy'
const FORMAT_HOUR     = 'HH:mm'
const FORMAT_HOURLESS = 'dd MMM yyyy'

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

const Anchor = styled('a')`
  color: ${({ $color }) => $color || 'initial'};
  
  &:hover {
    color: var(--bs-primary);
  }
`