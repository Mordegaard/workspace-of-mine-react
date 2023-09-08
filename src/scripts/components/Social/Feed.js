import React, { useCallback, useEffect, useState } from 'react'

import debounce from 'debounce'

import styled from 'styled-components'

import SocialController from 'scripts/methods/social'
import { useContextLoader, useCustomEvent } from 'scripts/methods/hooks'
import { Loader } from 'scripts/components/ui/Loader'
import { Column } from 'scripts/components/Social/Feed/Column'

export function Feed ({ selected }) {
  const { isLoading, throughLoading } = useContextLoader()

  const [ columns, setColumns ] = useState(SocialController.posts.items)

  const getAllPosts = () => {
    return throughLoading(async () => {
      selected
        ? await SocialController.posts[selected.type].getPostsBySource(selected.key)
        : await SocialController.posts.getAllPosts()
    })
  }

  const filterPosts = () => {
    setColumns(
      selected
        ? SocialController.posts.items.map(column => column.filter(({ source }) => source.key === selected.key))
        : [ ...SocialController.posts.items ]
    )
  }

  const scrollHandle = (callback) => {
    const bottoms = [ ...document.getElementsByClassName('social-column') ]
      .map(element => element.getBoundingClientRect().bottom - window.innerHeight)

    if (bottoms.some(bottom => bottom < THRESHOLD)) {
      callback()
    }
  }

  const debounceScrollHandle = useCallback(debounce(scrollHandle, DEBOUNCE_DELAY), [])

  useCustomEvent('posts:updated', () => {
    filterPosts()
  }, [ selected ])

  useEffect(() => {
    filterPosts()
  }, [ selected ])

  useEffect(() => {
    const handler = () => debounceScrollHandle(getAllPosts)

    if (!isLoading()) {
      window.addEventListener('scroll', handler)
    }

    return () => {
      window.removeEventListener('scroll', handler)
    }
  }, [ isLoading(), selected ])

  useEffect(() => {
    getAllPosts()
  }, [])

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
const THRESHOLD = 220

const Container = styled('div')`
`