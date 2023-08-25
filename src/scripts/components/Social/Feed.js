import React, { useCallback, useEffect, useState } from 'react'

import debounce from 'debounce'

import styled from 'styled-components'

import SocialSourcesController from 'scripts/methods/socialSources'
import { useContextLoader, useCustomEvent } from 'scripts/methods/hooks'
import { Loader } from 'scripts/components/ui/Loader'
import { Column } from 'scripts/components/Social/Feed/Column'

export function Feed () {
  const { isLoading, throughLoading } = useContextLoader()

  const [ columns, setColumns ] = useState(SocialSourcesController.items)

  const getAllPosts = () => {
    console.log('loading')
    return throughLoading(SocialSourcesController.reddit.getAllPosts.bind(SocialSourcesController.reddit))
  }

  const scrollHandle = () => {
    const bottoms = [ ...document.getElementsByClassName('social-column') ]
      .map(element => element.getBoundingClientRect().bottom - window.innerHeight)

    if (bottoms.some(bottom => bottom < THRESHOLD)) {
      getAllPosts()
    }
  }

  const debounceScrollHandle = useCallback(debounce(scrollHandle, DEBOUNCE_DELAY), [])

  useCustomEvent('posts:updated', () => {
    setColumns([ ...SocialSourcesController.items ])
  })

  useEffect(() => {
    getAllPosts()
  }, [])

  useEffect(() => {
    if (!isLoading()) {
      window.addEventListener('scroll', debounceScrollHandle)
    }

    return () => {
      window.removeEventListener('scroll', debounceScrollHandle)
    }
  }, [ isLoading() ])

  console.log(isLoading())

  return <>
    <Container className='row justify-content-center'>
      {
        columns.map((posts, index) => <Column key={index} posts={posts} />)
      }
    </Container>
    {
      isLoading() && <div className='w-100 flexed'>
        <Loader size={36} color='white' />
      </div>
    }
  </>
}

const DEBOUNCE_DELAY = 33
const THRESHOLD = 180

const Container = styled('div')`
`