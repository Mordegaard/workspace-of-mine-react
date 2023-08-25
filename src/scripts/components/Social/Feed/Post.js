import React from 'react'

import { format, isSameDay } from 'date-fns'
import { uk as locale } from 'date-fns/locale'

import styled from 'styled-components'
import { Images } from 'scripts/components/Social/Feed/Post/Images'
import { SOURCE_REDDIT, SOURCE_TELEGRAM } from 'scripts/methods/socialSources'

/**
 *
 * @param {FormattedPost} post
 * @return {JSX.Element}
 * @constructor
 */
export function PostBase ({ post }) {
  const isTrimmed = post.text.length > TEXT_THRESHOLD
  const text = isTrimmed ? post.text.slice(0, TEXT_THRESHOLD).trim() + '...' : post.text

  const createdAt = new Date(post.createdAt)

  return <Container>
    <div className='d-flex justify-content-between px-3 py-2'>
      {
        post.links.map((link, index) =>
          <Anchor key={index} href={link.url} className='flexed'>
            { LINK_ICONS[link.type]?.(post) }
            { link.name }
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
            { text }
          </Anchor>
        </div>
      }
      {
        isTrimmed && <div>
          { post.text }
        </div>
      }
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

const TEXT_THRESHOLD = 42
const FORMAT_FULL     = 'HH:mm dd MMM yyyy'
const FORMAT_HOUR     = 'HH:mm'
const FORMAT_HOURLESS = 'dd MMM yyyy'

const LINK_ICONS = {
  source: (post) => ({
    [SOURCE_REDDIT]: <i className='bi bi-reddit me-1 lh-0' />,
    [SOURCE_TELEGRAM]: <i className='bi bi-telegram me-1 lh-0' />
  })[post.type] ?? null,
  user: () => <i className='bi bi-person me-1 lh-0' />
}

const Container = styled('div')`
  background: var(--bs-pastel-gray-100);
  border-radius: 16px;
  margin: 1.5rem 0;
  box-shadow: -1px 1px 18px -10px black;
`

const Anchor = styled('a')`
  &:not(:hover) {
    color: inherit;
    text-decoration: none;
  }
`