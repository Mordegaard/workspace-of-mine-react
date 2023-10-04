import React from 'react'

import { format } from 'date-fns'
import locale from 'date-fns/locale/uk'

import styled from 'styled-components'

import { FORMAT_FULL } from 'scripts/components/Social/Feed/Post'

/**
 * @param {PostComment} comment
 * @param {?PostComment} replyTo
 * @return {JSX.Element}
 * @constructor
 */
export function Comment ({ comment, replyTo }) {
  const createdAt = new Date(comment.createdAt)
  const formattedCreatedAt = format(createdAt, FORMAT_FULL, { locale })

  return <Container>
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
      <div className='col-12'>
        { comment.text }
      </div>
    </div>
    <div className='row justify-content-between'>
      <div className='col-auto'>
        <span className='text-gray-500 fs-7' title={formattedCreatedAt}>
        <i className='bi bi-clock me-1' onClick={() => console.log(comment)} />
          { formattedCreatedAt }
      </span>
      </div>
    </div>
  </Container>
}

const Container = styled('div')`
  margin: 4px 0;
  padding: 8px 12px;
  border-radius: 12px;
  background: rgba(var(--bs-primary-rgb), 0.1);
`