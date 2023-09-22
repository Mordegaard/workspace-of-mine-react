import React, { useRef, useState } from 'react'

import styled, { keyframes } from 'styled-components'

import { BookmarkContainer } from 'scripts/components/Main/Bookmarks/BookmarkContainer'
import { BookmarkIcon } from 'scripts/components/Main/Bookmarks/BookmarkIcon'
import { ContextMenu, ContextMenuContainer } from 'scripts/components/ui/Helpers/ContextMenu'
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

  function openContextMenu (e) {
    e.preventDefault()
    setMenuVisible(true)
  }

  return <div ref={ref}>
    <a href={bookmark.url}>
      <BookmarkContainer>
        <BookmarkIcon bookmark={bookmark} />
        <div className='text-truncate w-100 text-center' title={bookmark.name}>{ bookmark.name }</div>
        <DotsButton className='icon-button' onClick={openContextMenu}>
          <i className='bi bi-three-dots-vertical lh-0' />
        </DotsButton>
      </BookmarkContainer>
    </a>
    <ContextMenu
      containerRef={ref}
      visible={menuVisible}
      popperOptions={{
        placement: 'right',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [20, -40]
            }
          }
        ]
      }}
      onChange={setMenuVisible}
    >
      <StyledContextMenuContainer>
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
      </StyledContextMenuContainer>
    </ContextMenu>
  </div>
}

const appearing = keyframes`
  0%   { transform: translate(-10px, -10px); opacity: 0; }
  66%  { transform: translate(5px, 5px); opacity: 1; }
  100% { transform: none; opacity: 1; }
`

const StyledContextMenuContainer = styled(ContextMenuContainer)`
  animation: ${appearing} 0.25s ease;
`

const DotsButton = styled('button')`
  visibility: hidden;
  position: absolute;
  top: 8px;
  right: 8px;
  color: var(--bs-primary-darker);
  
  ${BookmarkContainer}:hover & {
    visibility: visible;
  }
`