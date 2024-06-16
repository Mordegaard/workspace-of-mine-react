import React, { useEffect, useState } from 'react'

import { usePopper } from 'react-popper'

import styled, { keyframes } from 'styled-components'

import { useBlurHook } from 'scripts/methods/hooks'

export function ContextMenu ({
                               children,
                               containerRef,
                               trigger = ContextMenu.TRIGGER_BUTTON_RIGHT,
                               visible: initialVisible = null,
                               popperOptions = {},
                               onChange,
                               ...props
}) {
  const [ position, setPosition ] = useState([0, 0])
  const [ visible, setVisible ] = useState(initialVisible ?? false)
  const [ popperElement, setPopperElement ] = useState(null)

  const trueVisible = initialVisible ?? visible

  const hide = (e) => {
    if (e instanceof MouseEvent && e.composedPath().includes(popperElement)) return
    toggleVisible(false)
  }

  const show = e => {
    e.preventDefault()

    const boundingBox = containerRef.current.getBoundingClientRect()
    setPosition([ e.clientX - boundingBox.x, e.clientY - boundingBox.y - boundingBox.height ])

    toggleVisible(true)
  }

  const { styles, attributes } = usePopper(containerRef.current, popperElement, {
    placement: 'bottom-start',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: position
        }
      }
    ],
    ...popperOptions,
  })

  function toggleVisible (value = !trueVisible) {
    setVisible(value)

    if (typeof onChange === 'function' && trueVisible !== value) {
      onChange(value)
    }
  }

  useEffect(() => {
    setVisible(initialVisible)
  }, [ initialVisible ])

  useEffect(() => {
    const [ showEvent, hideEvent ] = eventMapping[trigger]

    if (!trueVisible) {
      containerRef.current.addEventListener(showEvent, show)
    } else if (hideEvent) {
      containerRef.current.addEventListener(hideEvent, hide)
    }

    return () => {
      containerRef.current?.removeEventListener(showEvent, show)
      containerRef.current?.removeEventListener(hideEvent, hide)
    }
  }, [ trueVisible ])

  useEffect(() => {
    const boundingBox = containerRef.current.getBoundingClientRect()
    setPosition([ boundingBox.width / 2, -boundingBox.height / 2 ])
  }, [])

  useBlurHook(
    containerRef,
    (e) => trigger !== ContextMenu.TRIGGER_HOVER && hide(e),
    [ popperElement, trigger ],
    () => popperElement != null
  )

  if (!trueVisible) return null

  return <Container
    ref={setPopperElement}
    style={styles.popper}
    {...attributes.popper}
    {...props}
  >
    { children }
  </Container>
}

ContextMenu.TRIGGER_BUTTON_LEFT  = 'lb'
ContextMenu.TRIGGER_BUTTON_RIGHT = 'rb'
ContextMenu.TRIGGER_HOVER        = 'hover'

const eventMapping = {
  [ContextMenu.TRIGGER_BUTTON_LEFT]: ['click'],
  [ContextMenu.TRIGGER_BUTTON_RIGHT]: ['contextmenu'],
  [ContextMenu.TRIGGER_HOVER]: ['mouseover', 'mouseleave'],
}

const Container = styled('div')`
  z-index: 2;
`

export const ContextMenuContainer = styled('div')`
  background: var(--bs-white);
  padding: 6px;
  border-radius: 12px;
  box-shadow: 1px 1px 16px -8px #00000080;
    
  body.dark & {
    background: var(--bs-gray-200);
  }
`

const appearing = keyframes`
  0%   { transform: translate(-10px, -10px); opacity: 0; }
  66%  { transform: translate(5px, 5px); opacity: 1; }
  100% { transform: none; opacity: 1; }
`

export const AnimatedContextMenuContainer = styled(ContextMenuContainer)`
  animation: ${appearing} 0.25s ease;
`