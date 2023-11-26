import React, { useEffect, useRef, useState } from 'react'

import styled, { css } from 'styled-components'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import { AddSource } from 'scripts/components/Social/SourcesSelector/AddSource'
import { Item } from 'scripts/components/Social/SourcesSelector/Item'
import { SocialController } from 'scripts/methods/social'

let scrollAnimationBuffer = 0
let animationPlayed = false

export function SourcesSelector ({ sources, selected, onSelect }) {
  const [ isAdding, setIsAdding ] = useState(false)
  const [ isDragging, setIsDragging ] = useState(false)

  const visibleSources = sources.filter(({ hidden }) => !hidden)
  const hiddenSources = sources.filter(({ hidden }) => hidden)

  const listRef = useRef()

  const handleDrop = async ({ source, destination }) => {
    setIsDragging(false)

    if (!destination) return

    const newSources = [ ...sources ]

    const currentSource = visibleSources[source.index]
    const currentDestination = visibleSources[destination.index]
    const startIndex = sources.findIndex(({ key }) => key === currentSource.key)
    const finishIndex = sources.findIndex(({ key }) => key === currentDestination.key)

    const [ target ] = newSources.splice(startIndex, 1)
    newSources.splice(finishIndex, 0, target)

    await SocialController.sources.updateAll(newSources)
  }

  const handleScrolling = (e) => {
    e.preventDefault()
    handleScrollAnimation(e.wheelDelta < 0 ? -12 : 12, listRef.current)
  }

  useEffect(() => {
    listRef.current.addEventListener('wheel', handleScrolling)

    return () => {
      listRef.current.removeEventListener('wheel', handleScrolling)
    }
  }, [])

  return <DragDropContext onDragEnd={handleDrop} onDragStart={setIsDragging.bind(null, true)}>
    <div className='row g-0'>
      <Droppable droppableId='sources-horizontal-list' direction='horizontal'>
        {
          (provided) => <List
            className='col'
            $isDragging={isDragging}
            $isAdding={isAdding}
            ref={ref => {
              provided.innerRef(ref)
              listRef.current = ref
            }}
            {...provided.droppableProps}
          >
            <Item
              className='fw-bold'
              source={{ name: 'Усі джерела' }}
              active={selected == null}
              onClick={onSelect.bind(null, null)}
            />
            {
              visibleSources.map((source, index) =>
                <Draggable key={source.key} index={index} draggableId={source.key}>
                  {
                    (provided) => <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Item
                        key={index}
                        source={source}
                        active={selected?.key === source.key}
                        onClick={onSelect.bind(null, source)}
                      />
                    </div>
                  }
                </Draggable>
              )
            }
            { provided.placeholder }
            {
              hiddenSources.map((source, index) =>
                <Item
                  key={index}
                  source={source}
                  active={selected?.key === source.key}
                  onClick={onSelect.bind(null, source)}
                />
              )
            }
          </List>
        }
      </Droppable>
      <ButtonContainer className='col-auto'>
        <AddSource active={isAdding} onActiveChange={setIsAdding} />
      </ButtonContainer>
    </div>
  </DragDropContext>
}

const PADDING = 36
const SCROLL_ANIMATION_SPEED = 2

const List = styled('div')`
  display: flex;
  overflow: hidden;
  transition: opacity 0.25s ease;
  
  ${({ $isDragging }) => $isDragging
    ? css`
            padding: 8px 0;
    `
    : css`
            padding: 8px ${PADDING}px;
            margin: 0 -${PADDING}px;
            -webkit-mask-image: linear-gradient(90deg, transparent 1%, white 3%, white 97%, transparent 99%);
    `
  }
  
  ${({ $isAdding }) => $isAdding && css`
    opacity: 0;
    pointer-events: none;
  `}
`

const ButtonContainer = styled('div')`
  padding: 8px 0;
  margin-left: ${PADDING}px;
`

function handleScrollAnimation (count, element) {
  if (count < 0 && element.scrollLeft + element.offsetWidth < element.scrollWidth || count > 0 && element.scrollLeft > 0) {
    scrollAnimationBuffer += count
  }

  if (animationPlayed === false) {
    animationPlayed = true

    window.requestAnimationFrame(function animation () {
      element.scrollLeft -= scrollAnimationBuffer

      switch (true) {
        case scrollAnimationBuffer < 0:
          scrollAnimationBuffer += SCROLL_ANIMATION_SPEED
          window.requestAnimationFrame(animation)
          break
        case scrollAnimationBuffer > 0:
          scrollAnimationBuffer -= SCROLL_ANIMATION_SPEED
          window.requestAnimationFrame(animation)
          break
        default:
          animationPlayed = false
      }
    })
  }
}