import React, { useEffect, useState } from 'react'

import styled from 'styled-components'
import SocialSourcesController from 'scripts/methods/socialSources'
import { useCustomEvent } from 'scripts/methods/hooks'
import { Loader } from 'scripts/components/ui/Loader'
import { Column } from 'scripts/components/Social/Feed/Column'

export function Feed () {
  const [ columns, setColumns ] = useState(SocialSourcesController.items)

  useCustomEvent('posts:updated', () => {
    setColumns([ ...SocialSourcesController.items ])
  })

  useEffect(() => {
    SocialSourcesController.reddit.getAllPosts()
  }, [])

  return <>
    <Container className='row justify-content-center'>
      {
        columns.map((posts, index) => <Column key={index} posts={posts} />)
      }
    </Container>
    {
      columns.length === 0 && <div className='w-100 flexed'>
        <Loader size={36} color='white' />
      </div>
    }
  </>
}

const Container = styled('div')`
`