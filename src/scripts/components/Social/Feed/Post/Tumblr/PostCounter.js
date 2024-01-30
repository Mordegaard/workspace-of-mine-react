import React from 'react'

import styled from 'styled-components'

import { Tag } from 'scripts/components/Social/Feed/Post/Tumblr/Tag'

/**
 * @param {FormattedPost} post
 * @param {boolean} interactive
 * @param {Object} props
 * @return {JSX.Element}
 * @constructor
 */
export function PostCounter ({ post, ...props }) {
  return <>
    <div {...props}>
      <i className='bi bi-heart me-1' />
      { post.likes ?? 0 }
    </div>
    <TagsContainer className='row gx-1'>
      {
        post.tags.map((tag, index) =>
          <div key={index} className='col-auto'>
            <Tag post={post}>{ tag }</Tag>
          </div>
        )
      }
    </TagsContainer>
  </>
}

const TagsContainer = styled('div')`
  flex-basis: 100%;
`