import React from 'react'

import styled from 'styled-components'

import SocialController from 'scripts/methods/social'
import { Post } from 'scripts/components/Social/Feed/Post'

/**
 * @param {FormattedPost[]} posts
 * @return {JSX.Element}
 * @constructor
 */
export function Column ({ posts }) {
  return <Container className={`col-${12 / SocialController.posts.columnsCount} social-column`}>
    {
      posts.map((post) => <Post key={post.id} post={post} />)
    }
  </Container>
}

const Container = styled('div')`
  height: fit-content;
`