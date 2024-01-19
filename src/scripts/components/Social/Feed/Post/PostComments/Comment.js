import React from 'react'

import { format } from 'date-fns'
import locale from 'date-fns/locale/uk'

import styled from 'styled-components'

import { FORMAT_FULL } from 'scripts/components/Social/Feed/Post'
import { Media } from 'scripts/components/Social/Feed/Post/Media'
import { PostCounter } from 'scripts/components/Social/Feed/Post/PostCounter'
import { CommentAuthorPicture } from 'scripts/components/Social/Feed/Post/Telegram/CommentAuthorPicture'
import { SOURCE_TELEGRAM } from 'scripts/methods/social/constants'

/**
 * @param {PostComment} comment
 * @param {FormattedPost} post
 * @param {PostComment} [replyTo]
 * @return {JSX.Element}
 * @constructor
 */
export function Comment ({ comment, post, replyTo }) {
  const createdAt = new Date(comment.createdAt)
  const formattedCreatedAt = format(createdAt, FORMAT_FULL, { locale })

  return <div className='row gx-2 my-1'>
    {
      COMMENT_AUTHOR_PICTURE_MAPPING[post.type] && <div className='col-auto me-2'>
        {
          React.createElement(
            COMMENT_AUTHOR_PICTURE_MAPPING[post.type],
            { comment }
          )
        }
      </div>
    }
    <Container className='col-auto'>
      <div className='row'>
        <div className='col-auto'>
          <b>{ comment.author }</b>
        </div>
        {
          replyTo && <div className='col-auto'>
            <span className='badge bg-secondary'>
               У відповідь до <b>{ replyTo.author }</b>
            </span>
          </div>
        }
      </div>
      <div className='row'>
        {
          Array.isArray(comment.media)
          && comment.media.length > 0
          && <div className='col-12 my-2'>
            <Media media={comment.media} type={post.type} />
          </div>
        }
        <div className='col-12'>
          { comment.text }
        </div>
      </div>
      <div className='row justify-content-between'>
        <div className='col-auto'>
          <span className='text-gray-600 fs-7' title={formattedCreatedAt}>
            <i className='bi bi-clock me-1' onClick={() => console.log(comment)} />
            { formattedCreatedAt }
          </span>
        </div>
        <div className='col-auto'>
          <PostCounter post={comment} interactive={false} />
        </div>
      </div>
    </Container>
  </div>
}

const COMMENT_AUTHOR_PICTURE_MAPPING = {
  [SOURCE_TELEGRAM]: CommentAuthorPicture
}

const Container = styled('div')`
  width: fit-content;
  padding: 8px 12px;
  border-radius: 12px;
  background: rgba(var(--bs-primary-rgb), 0.1);
  max-width: 400px;
`