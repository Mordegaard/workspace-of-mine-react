import React, { useCallback, useEffect, useRef, useState } from 'react'

import styled, { css } from 'styled-components'

import { AddSourceButton } from 'scripts/components/Social/SourcesSelector/AddSourceButton'
import { HorizontalItem } from 'scripts/components/Social/SourcesSelector/HorizontalItem'
import { VerticalItem } from 'scripts/components/Social/SourcesSelector/VerticalItem'
import { SocialController } from 'scripts/methods/social'
import { THREE_COLUMNS_MODE, TWO_COLUMNS_MODE } from 'scripts/methods/constants'
import { mergeClasses } from 'scripts/methods/helpers'
import { useCustomEvent, useSettings } from 'scripts/methods/hooks'
import { AddSource } from 'scripts/components/Social/AddSource'
import { Dropdown } from 'scripts/components/ui/Dropdown'
import { imagesDb } from 'scripts/methods/indexedDb'
import { Droppable, Draggable } from 'scripts/components/DragDrop'

import CornerIcon from 'assets/icons/rounded-corner.svg'
import { SocialIcon } from 'scripts/components/ui/SocialIcon'

let scrollAnimationBuffer = 0
let animationPlayed = false

export function SourcesSelector ({ sources, selected, layoutMode, onSelect, ...rest }) {
  const settings = useSettings()

  const [ wallpaperSrc, setWallpaperSrc ] = useState(null)

  const visibleSources = sources.filter(({ hidden }) => !hidden)
  const hiddenSources = sources.filter(({ hidden }) => hidden)

  const [ ContainerComponent, ListComponent, ItemComponent ] = layoutMode === THREE_COLUMNS_MODE
    ? [ HorizontalContainer, HorizontalList, HorizontalItem ]
    : [ VerticalContainer, VerticalList, VerticalItem ]

  const listRef = useRef()

  const fetchWallpaper = useCallback((url = null) => {
    if (url) {
      setWallpaperSrc(url)
    } else {
      imagesDb.getImage('wallpaper').then(blob => setWallpaperSrc(URL.createObjectURL(blob)))
    }
  }, [])

  const handleDrop = useCallback(async ({ source, destination }) => {
    if (!destination) return

    const newSources = [ ...sources ]

    const startIndex = sources.findIndex(({ key }) => key === source.data.draggableData.key)
    const finishIndex = sources.findIndex(({ key }) => key === destination.data.draggableData.key)

    const [ target ] = newSources.splice(startIndex, 1)

    newSources.splice(finishIndex, 0, target)

    await SocialController.sources.updateAll(newSources)
  }, [ sources ])

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

  useCustomEvent('wallpaper:updated', ({ detail: url }) => fetchWallpaper(url), [])

  if (layoutMode == null) return null

  return <>
    <ContainerComponent
      $wallpaperSrc={wallpaperSrc}
      {...rest}
      className={mergeClasses('row g-0', layoutMode === THREE_COLUMNS_MODE ? 'col-12' : 'col-4', rest.className)}
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
        id='sources-list'
        orientation='list'
        onDrop={handleDrop}
      >
        {
          ({ droppableRef, isDragOver }) => <ListComponent
            className='col'
            $isDragging={isDragOver}
            ref={ref => {
              droppableRef.current = ref
              listRef.current = ref
            }}
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
                <Draggable
                  key={source.key}
                  id={source.key}
                  data={source}
                  previewStrategy='follow'
                  dragPreview={
                    <DragPreview className='d-flex align-items-center'>
                      <SocialIcon type={source.type} />
                      <div className='ms-3'>
                        { source.name ?? source.key }
                      </div>
                    </DragPreview>
                  }
                >
                  {
                    ({ draggableRef }) => <div ref={draggableRef}>
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
  </>
}

const PADDING = 36
const SCROLL_ANIMATION_SPEED = 2

const HorizontalContainer = styled('div')`
  position: sticky;
  top: -2px;
  flex: 0 0 auto;
  width: 100%;
  padding: 0.5rem 48px 2.5rem 48px;
  z-index: 1;
    
  ${({ $wallpaperSrc }) => $wallpaperSrc && css`
    background: fixed 50% 50% / cover url("${$wallpaperSrc}");
    mask-image: linear-gradient(0deg, transparent 0%, white 40%);
  `};
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
            mask-image: linear-gradient(90deg, transparent 1%, white 3%, white 97%, transparent 99%);
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
  height: calc(100% + 0.1px);
  width: fit-content;
  top: 0;
  left: 100%;
  color: var(--bs-gray-100);
`

const DragPreview = styled('div')`
  padding: 12px;
  border-radius: 8px;
  box-shadow: 2px 2px 18px -8px #00000080;
  background: var(--bs-gray-100);
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