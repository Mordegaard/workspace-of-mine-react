import React, { useEffect, useState } from 'react'

import SocialController from 'scripts/methods/social'
import { useContextLoader } from 'scripts/methods/hooks'
import { Loader } from 'scripts/components/ui/Loader'
import { Column } from 'scripts/components/Social/Feed/Column'
import { useFeedEnd } from 'scripts/methods/hooks/feedEnd'

/**
 * @param {SourceBookmarks} selected
 * @returns {React.JSX.Element}
 * @constructor
 */
export function BookmarksFeed ({ selected }) {
  const { isLoading, throughLoading } = useContextLoader({ base: true })

  const [ columns, setColumns ] = useState(Array.range(SocialController.posts.columnsCount).map(() => []))
  const [ page, setPage ] = useState(1)

  const onFeedEnd = useFeedEnd(fetchBookmarks)

  function fetchBookmarks (columnsParam = columns, pageParam = page) {
    return throughLoading(async () => {

      const posts = await selected.getBookmarks({ page: pageParam })

      if (posts.length === 0) {
        return
      }

      const chunks = posts.chunk(Math.ceil(posts.length / SocialController.posts.columnsCount))
      const newColumns = columnsParam.map((oldPosts, index) => [ ...oldPosts, ...(chunks[index] ?? []) ])

      setPage(pageParam)
      setColumns(newColumns)
    })
  }

  useEffect(() => {
    fetchBookmarks()
  }, [])

  useEffect(() => {
    const handler = () => onFeedEnd(columns, page + 1)

    if (!isLoading()) {
      window.addEventListener('scroll', handler)
    }

    return () => {
      window.removeEventListener('scroll', handler)
    }
  }, [ isLoading(), page, columns ])

  return <div className='col'>
    <div className='row justify-content-center'>
      {
        columns.map((posts, index) => <Column key={ index } posts={ posts }/>)
      }
    </div>
    {
      isLoading() && <div className='w-100 flexed'>
        <Loader size={ 36 } color='white'/>
      </div>
    }
  </div>
}