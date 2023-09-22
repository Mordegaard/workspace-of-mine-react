import React, { useEffect, useState } from 'react'

import { usePopper } from 'react-popper'

import styled from 'styled-components'

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
  const [ visible, setVisible ] = useState(initialVisible ?? false)
  const [ popperElement, setPopperElement ] = useState(null)

  const trueVisible = initialVisible ?? visible

  const hide = () => {
    toggleVisible(false)
  }

  const show = e => {
    e.preventDefault()
    toggleVisible(true)
  }

  const { styles, attributes } = usePopper(containerRef.current, popperElement, {
    placement: 'bottom',
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

  if (trigger !== ContextMenu.TRIGGER_HOVER) {
    useBlurHook(containerRef, hide, [ trueVisible ])
  }

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
  z-index: 9;
`

export const ContextMenuContainer = styled('div')`
  background: var(--bs-gray-100);
  padding: 6px;
  border-radius: 12px;
  box-shadow: 1px 1px 16px -8px #00000080;
`