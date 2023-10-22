import React, { useContext, useEffect, useState } from 'react'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

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
  const [ dragContext, setDragContext ] = useState(null)

  const showAddBookmarkButton = context.showAddBookmarkButton === true && bookmarks.length < MAX_BOOKMARKS_COUNT

  const chunks = bookmarks.chunk(COLUMNS)
  const droppableIds = chunks.map((chunk, index) => `bookmarks-grid-${index}`)

  const fetchBookmarks = async () => {
    setBookmarks(await BookmarksController.get())
  }

  const handleDrop = async ({ source, destination }) => {
    setDragContext(null)

    if (!destination) return

    const newBookmarks = [ ...bookmarks ]

    const sourceDroppableIndex = droppableIds.findIndex(id => id === source.droppableId)
    const destinationDroppableIndex = droppableIds.findIndex(id => id === destination.droppableId)

    const startIndex = sourceDroppableIndex * COLUMNS + source.index
    const finishIndex = destinationDroppableIndex * COLUMNS + destination.index

    if (!(newBookmarks[startIndex] && newBookmarks[finishIndex])) return

    const start = { ...newBookmarks[startIndex] }
    const finish = { ...newBookmarks[finishIndex] }

    newBookmarks[startIndex] = finish
    newBookmarks[finishIndex] = start

    setBookmarks(newBookmarks)

    await BookmarksController.updateAll(newBookmarks)
  }

  const getDndStyles = (style, snapshot) => {
    if (!snapshot.isDragging) return {}
    if (!snapshot.isDropAnimating) {
      return style
    }

    return {
      ...style,
      transitionDuration: `0.001s`
    }
  }

  useCustomEvent('bookmarks:updated', fetchBookmarks)

  useEffect(() => {
    fetchBookmarks()
  }, [])

  return <DragDropContext
    onDragEnd={handleDrop}
    onDragUpdate={context => setDragContext(context)}
  >
    {
      bookmarks.length > 0 && <div className='d-flex flex-column'>
        {
          chunks.map((chunk, droppableIndex, arr) =>
            <Droppable
              key={droppableIds[droppableIndex]}
              droppableId={droppableIds[droppableIndex]}
              direction='horizontal'
            >
              {
                (provided) => <GridContainer
                  ref={provided.innerRef}
                  $hasContent={bookmarks.length > 0}
                  {...provided.droppableProps}
                >
                  {
                    chunk.map((bookmark, draggableIndex) =>
                      <Draggable key={bookmark.url} index={draggableIndex} draggableId={bookmark.url}>
                        {
                          (provided, snapshot) => <>
                            {
                              snapshot.isDragging && <ActualPlaceholder />
                            }
                            <DraggableContainer
                              ref={provided.innerRef}
                              $highlighted={
                                dragContext?.destination
                                && dragContext.destination.droppableId === droppableIds[droppableIndex]
                                && dragContext.destination.index === draggableIndex
                                && !(dragContext.source.droppableId === droppableIds[droppableIndex] && dragContext.source.index === draggableIndex)
                              }
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getDndStyles(provided.draggableProps.style, snapshot)}
                            >
                              <Item key={draggableIndex} bookmark={bookmark} />
                            </DraggableContainer>
                          </>
                        }
                      </Draggable>
                    )
                  }
                  <div className='d-none'>{ provided.placeholder }</div>
                  {
                    bookmarks.length > 0 && showAddBookmarkButton && droppableIndex === arr.length - 1 && <BookmarkContainer
                      onClick={() => Events.trigger('bookmarks:edit')}
                    >
                      <i className='bi bi-plus-lg lh-0 fs-4' />
                    </BookmarkContainer>
                  }
                </GridContainer>
              }
            </Droppable>
          )
        }
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
  </DragDropContext>
}

const COLUMNS = 6

const GridContainer = styled('div')`
  width: fit-content;
  max-width: 85vw;
  
  ${({ $hasContent }) => $hasContent && css`
    width: 1200px;
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    grid-auto-flow: column;
  `}
`

const ActualPlaceholder = styled('div')`
  border-radius: 12px;
  border: 4px dashed white;
`

const DraggableContainer = styled('div')`
  box-sizing: content-box;
  border: 4px solid transparent;
  
  ${({ $highlighted }) => $highlighted && css`
    border-radius: 12px;
    border: 4px dashed white;
  `}
`