import React, { useContext, useEffect, useState } from 'react'

import styled, { css } from 'styled-components'

import { useCustomEvent } from 'scripts/methods/hooks'
import { BookmarksController } from 'scripts/methods/bookmarks'
import { GeneralContext } from 'scripts/components/Context'
import { Item } from 'scripts/components/Main/Bookmarks/Item'
import { BookmarkContainer } from 'scripts/components/Main/Bookmarks/BookmarkContainer'
import { MAX_BOOKMARKS_COUNT } from 'scripts/methods/bookmarks/constants'
import Events from 'scripts/methods/events'

export function Bookmarks () {
  const context = useContext(GeneralContext)

  const [ bookmarks, setBookmarks ] = useState([])

  const showAddBookmarkButton = context.showAddBookmarkButton === true && bookmarks.length < MAX_BOOKMARKS_COUNT

  const fetchBookmarks = async () => {
    setBookmarks(await BookmarksController.get())
  }

  useCustomEvent('bookmarks:updated', fetchBookmarks)

  useEffect(() => {
    fetchBookmarks()
  }, [])

  return <Container $hasContent={bookmarks.length > 0}>
    {
      bookmarks.map((bookmark, index) =>
        <Item key={index} bookmark={bookmark} />
      )
    }
    {
      showAddBookmarkButton && <>
        {
          bookmarks.length > 0 && <BookmarkContainer
            onClick={() => Events.trigger('bookmarks:edit')}
          >
            <i className='bi bi-plus-lg lh-0 fs-4' />
          </BookmarkContainer>
        }
        {
          bookmarks.length === 0 && <BookmarkContainer
            className='text-nowrap'
            onClick={() => Events.trigger('bookmarks:edit')}
          >
            <i className='bi bi-plus-lg lh-0 fs-5 me-3' />
            Додати нову закладку
          </BookmarkContainer>
        }
      </>
    }
  </Container>
}

const Container = styled('div')`
  width: fit-content;
  max-width: 85vw;
  
  ${({ $hasContent }) => $hasContent && css`
    width: 1200px;
    display: grid;
    grid-template-columns: repeat(6, minmax(0,1fr));
    gap: 16px;
  `}
`