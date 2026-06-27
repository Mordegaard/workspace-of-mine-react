import React, { useCallback, useContext, useEffect, useState } from 'react'

import styled, { css } from 'styled-components'

import { useCustomEvent, useSettings } from 'scripts/methods/hooks'
import { BookmarksController } from 'scripts/methods/bookmarks'
import { GeneralContext } from 'scripts/components/Context'
import { Item } from 'scripts/components/Main/Bookmarks/Item'
import { BookmarkContainer } from 'scripts/components/Main/Bookmarks/BookmarkContainer'
import Events from 'scripts/methods/events'
import { Draggable, Droppable } from 'scripts/components/DragDrop'
import { BookmarkIcon } from 'scripts/components/Main/Bookmarks/BookmarkIcon'

export function Bookmarks () {
  const context = useContext(GeneralContext)
  const settings = useSettings()

  const { rows, columns } = settings.layout.bookmarks_grid

  const [ bookmarks, setBookmarks ] = useState([])

  const showAddBookmarkButton = context.showAddBookmarkButton === true && bookmarks.length < rows * columns

  const handleDrop = useCallback(async (source, destination) => {
    if (!destination) return

    const newBookmarks = [ ...bookmarks ]

    const startIndex = source.data.draggableData.index
    const finishIndex = destination.data.draggableData.index

    if (!(newBookmarks[startIndex] && newBookmarks[finishIndex])) return

    const start = newBookmarks[startIndex]
    const finish = newBookmarks[finishIndex]

    newBookmarks[startIndex] = finish
    newBookmarks[finishIndex] = start

    await BookmarksController.updateAll(newBookmarks)
  }, [ bookmarks ])

  useCustomEvent('bookmarks:updated', data => setBookmarks(data.detail))

  useEffect(() => {
    BookmarksController.get().then(setBookmarks)
  }, [])

  return <>
    {
      bookmarks.length > 0 && <div>
        <Droppable
          id='bookmarks-grid'
          orientation='grid'
          onDrop={({ source, destination }) => handleDrop(source, destination)}
        >
          {
            ({ droppableRef, state }) => <GridContainer
              ref={droppableRef}
              $hasContent={bookmarks.length > 0}
              $columns={columns}
              $state={state}
            >
              {
                bookmarks.slice(0, rows * columns).map((bookmark) =>
                  <Draggable
                    key={`${bookmark.url}-${bookmark.index}`}
                    id={`${bookmark.url}-${bookmark.index}`}
                    data={bookmark}
                    dragPreview={<DragPreview><BookmarkIcon bookmark={bookmark} /></DragPreview>}
                    previewStrategy='follow'
                  >
                    {
                      ({ draggableRef, isDragging, isDraggingOver }) => <DraggableContainer
                        ref={draggableRef}
                        $isDragging={isDragging}
                        $isDraggingOver={isDraggingOver}
                      >
                        <Item bookmark={bookmark} />
                      </DraggableContainer>
                    }
                  </Draggable>
                )
              }
              {
                bookmarks.length > 0 && showAddBookmarkButton && <BookmarkContainer
                  onClick={() => Events.trigger('bookmarks:edit')}
                >
                  <i className='bi bi-plus-lg lh-0 fs-4' />
                </BookmarkContainer>
              }
            </GridContainer>
          }
        </Droppable>
      </div>
    }
    {
      bookmarks.length === 0 && showAddBookmarkButton && <BookmarkContainer
        className='text-nowrap'
        onClick={() => Events.trigger('bookmarks:edit')}
      >
        <i className='bi bi-plus-lg lh-0 fs-5 me-3' />
        Додати нову закладку
      </BookmarkContainer>
    }
  </>
}

const GridContainer = styled('div').attrs(({ $columns }) => ({
  style: {
    width: `${200 * $columns}px`,
    gridTemplateColumns: `repeat(${$columns}, minmax(0, 1fr))`
  }
}))`
  width: fit-content;
  max-width: 85vw;
  
  ${({ $hasContent }) => $hasContent && css`
    display: grid;
  `}
`

const DraggableContainer = styled('div')`
  box-sizing: content-box;
  border-radius: 18px;
    
  ${({ $isDragging }) => $isDragging && css`
    opacity: 0.5;
  `}

  ${({ $isDraggingOver }) => $isDraggingOver && css`
    outline: 4px dashed white;
  `}
`

const DragPreview = styled('div')`
  padding: 12px;
  border-radius: 8px;
  box-shadow: 2px 2px 18px -8px #00000080;
  background: var(--bs-gray-100);
`