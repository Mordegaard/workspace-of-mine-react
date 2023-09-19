import React, { useRef, useState } from 'react'

import styled, { keyframes } from 'styled-components'

import { BookmarkContainer } from 'scripts/components/Main/Bookmarks/BookmarkContainer'
import { BookmarkIcon } from 'scripts/components/Main/Bookmarks/BookmarkIcon'
import { ContextMenu } from 'scripts/components/ui/Helpers/ContextMenu'
import { BookmarksController } from 'scripts/methods/bookmarks'
import Events from 'scripts/methods/events'

/**
 * @param {Bookmark} bookmark
 * @return {JSX.Element}
 * @constructor
 */
export function Item ({ bookmark }) {
  const [ menuVisible, setMenuVisible ] = useState(false)

  const ref = useRef()

  return <>
    <a href={bookmark.url} ref={ref}>
      <BookmarkContainer>
        <BookmarkIcon bookmark={bookmark} />
        { bookmark.name }
      </BookmarkContainer>
    </a>
    <ContextMenu containerRef={ref} visible={menuVisible} onChange={setMenuVisible}>
      <ContextMenuContainer>
        <button
          className='btn btn-sm btn-basic-primary w-100 d-block'
          onClick={() => Events.trigger('bookmarks:edit', bookmark)}
        >
          <div className='w-100 text-start'>
            <i className='bi bi-pencil-square me-3' />
            Редагувати
          </div>
        </button>
        <button
          className='btn btn-sm btn-basic-danger w-100 d-block'
          onClick={() => BookmarksController.remove(bookmark.index)}
        >
          <div className='w-100 text-start'>
            <i className='bi bi-trash me-3' />
            Видалити
          </div>
        </button>
      </ContextMenuContainer>
    </ContextMenu>
  </>
}

const appearing = keyframes`
  0%   { transform: translate(-10px, -10px); opacity: 0; }
  66%  { transform: translate(5px, 5px); opacity: 1; }
  100% { transform: none; opacity: 1; }
`

const ContextMenuContainer = styled('div')`
  background: var(--bs-gray-100);
  padding: 6px;
  border-radius: 12px;
  box-shadow: 1px 1px 16px -8px #00000080;
  animation: ${appearing} 0.25s ease;
`