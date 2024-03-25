import React, { useCallback, useEffect, useState } from 'react'

import debounce from 'debounce'

import styled from 'styled-components'

import SocialController from 'scripts/methods/social'
import { useContextLoader, useCustomEvent } from 'scripts/methods/hooks'
import { Loader } from 'scripts/components/ui/Loader'
import { Column } from 'scripts/components/Social/Feed/Column'

export function Feed ({ sources, selected }) {
  const { isLoading, throughLoading } = useContextLoader({ base: SocialController.posts.loading })

  const [ columns, setColumns ] = useState(null)

  const getAllPosts = () => {
    return throughLoading(async () => {
      selected
        ? await SocialController.posts[selected.type].getPostsBySource(selected.key)
        : await SocialController.posts.getAllPosts()
    })
  }

  const filterPosts = ({ fetch = false } = {}) => {
    const hiddenSourcesKeys = sources
      .filter(({ hidden }) => hidden)
      .map(({ key }) => key)

    const items = selected
      ? SocialController.posts.items
        .map(column => column.filter(({ source }) => source.key === selected.key))
      : SocialController.posts.items
        .map(column => column.filter(({ source }) => !hiddenSourcesKeys.includes(source.key)))

    setColumns(items)

    if (fetch && items.flat().length === 0) {
      getAllPosts()
    }
  }

  const scrollHandle = (callback) => {
    const bottoms = [ ...document.getElementsByClassName('social-column') ]
      .map(element => element.getBoundingClientRect().bottom - window.innerHeight)

    if (bottoms.some(bottom => bottom < THRESHOLD)) {
      callback()
    }
  }

  const debounceScrollHandle = useCallback(debounce(scrollHandle, DEBOUNCE_DELAY), [ selected ])

  useCustomEvent('posts:updated', () => {
    filterPosts()
  }, [ selected ])

  useEffect(() => {
    filterPosts({ fetch: true })
  }, [ selected ])

  useEffect(() => {
    filterPosts()
  }, [ sources ])

  useEffect(() => {
    const handler = () => debounceScrollHandle(getAllPosts)

    window.addEventListener('scroll', handler)

    return () => {
      window.removeEventListener('scroll', handler)
    }
  }, [ selected ])

  if (columns == null) {
    return null
  }

  return <div className='col'>
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
  </div>
}

const DEBOUNCE_DELAY = 33
const THRESHOLD = 250

const Container = styled('div')`
`