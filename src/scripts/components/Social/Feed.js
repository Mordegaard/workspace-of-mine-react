import React, { useEffect, useState } from 'react'

import SocialController from 'scripts/methods/social'
import { useContextLoader, useCustomEvent } from 'scripts/methods/hooks'
import { Loader } from 'scripts/components/ui/Loader'
import { Column } from 'scripts/components/Social/Feed/Column'
import { useFeedEnd } from 'scripts/methods/hooks/feedEnd'

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

  const onFeedEnd = useFeedEnd(getAllPosts, [ selected ])

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
    setTimeout(() => window.addEventListener('scroll', onFeedEnd), 150)

    return () => {
      window.removeEventListener('scroll', onFeedEnd)
    }
  }, [ selected ])

  if (columns == null) {
    return null
  }

  return <div className='col'>
    <div className='row justify-content-center'>
      {
        columns.map((posts, index) => <Column key={index} posts={posts} />)
      }
    </div>
    {
      isLoading() && <div className='w-100 flexed'>
        <Loader size={36} color='white' />
      </div>
    }
  </div>
}