import React, { useEffect, useRef, useState } from 'react'

import styled, { css } from 'styled-components'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import { AddSource } from 'scripts/components/Social/SourcesSelector/AddSource'
import { HorizontalItem } from 'scripts/components/Social/SourcesSelector/HorizontalItem'
import { VerticalItem } from 'scripts/components/Social/SourcesSelector/VerticalItem'
import { SocialController } from 'scripts/methods/social'
import { THREE_COLUMNS_MODE, TWO_COLUMNS_MODE } from 'scripts/methods/constants'
import { mergeClasses } from 'scripts/methods/helpers'
import { useCustomEvent } from 'scripts/methods/hooks'
import { RoundButton } from 'scripts/components/Social/SourcesSelector/RoundButton'

let scrollAnimationBuffer = 0
let animationPlayed = false

export function SourcesSelector ({ sources, selected, onSelect }) {
  const [ layoutMode, setLayoutMode ] = useState(null)
  const [ isAdding, setIsAdding ] = useState(false)
  const [ isDragging, setIsDragging ] = useState(false)

  const visibleSources = sources.filter(({ hidden }) => !hidden)
  const hiddenSources = sources.filter(({ hidden }) => hidden)

  const [ ContainerComponent, ListComponent, ItemComponent ] = layoutMode === THREE_COLUMNS_MODE
    ? [ HorizontalContainer, HorizontalList, HorizontalItem ]
    : [ VerticalContainer, VerticalList, VerticalItem ]

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

  function handleScrolling (e) {
    e.preventDefault()
    handleScrollAnimation(e.wheelDelta < 0 ? -12 : 12, listRef.current)
  }

  function renderSeparator () {
    return layoutMode === TWO_COLUMNS_MODE && <hr />
  }

  useEffect(() => {
    if (layoutMode === THREE_COLUMNS_MODE) {
      listRef.current.addEventListener('wheel', handleScrolling)
    }

    return () => {
      listRef.current.removeEventListener('wheel', handleScrolling)
    }
  }, [ layoutMode ])

  useCustomEvent('posts:updated', () => {
    setLayoutMode(SocialController.posts.items.length)
  })

  if (layoutMode == null) return null

  return <DragDropContext onDragEnd={handleDrop} onDragStart={setIsDragging.bind(null, true)}>
    <ContainerComponent
      className={mergeClasses('row g-0', layoutMode === THREE_COLUMNS_MODE ? 'col-12' : 'col-4')}
    >
      {
        layoutMode === TWO_COLUMNS_MODE && <div className='d-flex justify-content-end'>
          <ButtonContainer className='mx-2'>
            <RoundButton>
              <i className='bi bi-filter' />
            </RoundButton>
          </ButtonContainer>
          <ButtonContainer className='col-auto'>
            <AddSource active={isAdding} onActiveChange={setIsAdding} />
          </ButtonContainer>
        </div>
      }
      <Droppable
        droppableId='sources-list'
        direction={layoutMode === THREE_COLUMNS_MODE ? 'horizontal' : 'vertical'}
      >
        {
          (provided) => <ListComponent
            className='col'
            $isDragging={isDragging}
            $isAdding={isAdding}
            ref={ref => {
              provided.innerRef(ref)
              listRef.current = ref
            }}
            {...provided.droppableProps}
          >
            <ItemComponent
              className='fw-bold'
              source={{ name: 'Усі джерела' }}
              active={selected == null}
              onClick={onSelect.bind(null, null)}
            />
            { renderSeparator() }
            {
              visibleSources.map((source, index) =>
                <Draggable key={source.key} index={index} draggableId={source.key}>
                  {
                    (provided) => <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <ItemComponent
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
            { renderSeparator() }
            {
              hiddenSources.map((source, index) =>
                <ItemComponent
                  key={index}
                  source={source}
                  active={selected?.key === source.key}
                  onClick={onSelect.bind(null, source)}
                />
              )
            }
          </ListComponent>
        }
      </Droppable>
      {
        layoutMode === THREE_COLUMNS_MODE && <ButtonContainer
          className='col-auto'
          style={{ marginLeft: PADDING }}
        >
          <AddSource active={isAdding} onActiveChange={setIsAdding} />
        </ButtonContainer>
      }
    </ContainerComponent>
  </DragDropContext>
}

const PADDING = 36
const SCROLL_ANIMATION_SPEED = 2

const HorizontalContainer = styled('div')`
  flex: 0 0 auto;
  width: 100%;
  margin-bottom: 1rem;
`

const VerticalContainer = styled('div')`
  flex: 0 0 auto;
  width: 33.333333%;
  position: sticky;
  top: 1rem;
  height: fit-content;
  margin-right: 1rem;
`

const HorizontalList = styled('div')`
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

const VerticalList = styled('div').attrs({ className: 'shadowed' })`
  display: flex;
  flex-flow: column nowrap;
  background: var(--bs-gray-100);
  border-radius: 16px;
  padding: 12px;
  height: fit-content;
`

const ButtonContainer = styled('div')`
  padding: 8px 0;
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