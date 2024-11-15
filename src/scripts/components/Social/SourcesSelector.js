import React, { useEffect, useRef, useState } from 'react'

import styled, { css } from 'styled-components'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import { AddSourceButton } from 'scripts/components/Social/SourcesSelector/AddSourceButton'
import { HorizontalItem } from 'scripts/components/Social/SourcesSelector/HorizontalItem'
import { VerticalItem } from 'scripts/components/Social/SourcesSelector/VerticalItem'
import { SocialController } from 'scripts/methods/social'
import { THREE_COLUMNS_MODE, TWO_COLUMNS_MODE } from 'scripts/methods/constants'
import { mergeClasses } from 'scripts/methods/helpers'
import { useCustomEvent, useSettings } from 'scripts/methods/hooks'
import { AddSource } from 'scripts/components/Social/AddSource'

import CornerIcon from 'assets/icons/rounded-corner.svg'
import { Dropdown } from 'scripts/components/ui/Dropdown'

let scrollAnimationBuffer = 0
let animationPlayed = false

export function SourcesSelector ({ sources, selected, onSelect }) {
  const settings = useSettings()

  const [ layoutMode, setLayoutMode ] = useState(SocialController.posts.items.length)
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
    return layoutMode === TWO_COLUMNS_MODE && sources.length > 0 && <hr />
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
        layoutMode === TWO_COLUMNS_MODE && <div className='d-flex justify-content-between'>
          <TwoColumnAllSourcesContainer>
            <ItemComponent
              className='fw-bold'
              source={{ name: 'Усі джерела' }}
              active={selected == null}
              onClick={onSelect.bind(null, null)}
            />
            {
              layoutMode === TWO_COLUMNS_MODE && <StyledCornerIcon />
            }
          </TwoColumnAllSourcesContainer>
          <div className='d-flex'>
            <ButtonContainer className='col-auto'>
              <AddSourceButton />
            </ButtonContainer>
          </div>
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
            ref={ref => {
              provided.innerRef(ref)
              listRef.current = ref
            }}
            {...provided.droppableProps}
          >
            {
              layoutMode === THREE_COLUMNS_MODE && <ItemComponent
                className='fw-bold'
                source={{ name: 'Усі джерела' }}
                active={selected == null}
                onClick={onSelect.bind(null, null)}
              />
            }
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
            { layoutMode === TWO_COLUMNS_MODE && sources.length === 0 && <span className='text-gray-400 text-center mt-2'>Ще не додано жодного джерела</span> }
            { provided.placeholder }
            { renderSeparator() }
            {
              settings.layout.dropdown_hidden_sources === true && hiddenSources.length > 0 && <Dropdown
                withPortal
                selected={selected}
                items={
                  hiddenSources.map((source, index) => ({
                    value: source,
                    label: <VerticalItem
                      key={index}
                      source={source}
                      active={selected?.key === source.key}
                      onClick={onSelect.bind(null, source)}
                      neutral
                    />
                  }))
                }
              >
                <ItemComponent
                  className='fw-bold'
                  source={{ name: `Приховані джерела (${hiddenSources.length})` }}
                />
              </Dropdown>
            }
            {
              settings.layout.dropdown_hidden_sources !== true && hiddenSources.map((source, index) =>
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
          <AddSourceButton />
        </ButtonContainer>
      }
    </ContainerComponent>
    <AddSource />
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
`

const VerticalList = styled('div').attrs({ className: 'shadowed' })`
  display: flex;
  flex-flow: column nowrap;
  background: var(--bs-gray-100);
  border-radius: 0 16px 16px 16px;
  padding: 0 12px 12px 12px;
  height: fit-content;
`

const ButtonContainer = styled('div')`
  display: flex;
  padding: 8px 0;
    
  button:not(:last-child) {
    margin-right: 8px;
  }
`

const TwoColumnAllSourcesContainer = styled('div')`
  padding: 12px 0 0 12px;
  position: relative;
  border-top-left-radius: 16px;
  background: var(--bs-gray-100);
`

const StyledCornerIcon = styled(CornerIcon)`
  position: absolute;
  height: calc(100% + 0.5px);
  width: fit-content;
  top: 0;
  left: 100%;
  color: var(--bs-gray-100);
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