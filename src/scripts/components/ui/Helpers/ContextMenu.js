import React, { useEffect, useState } from 'react'

import { usePopper } from 'react-popper'

import styled from 'styled-components'

import { useBlurHook } from 'scripts/methods/hooks'

export function ContextMenu ({ children, containerRef, visible: initialVisible = false, onChange, ...props }) {
  const [ visible, setVisible ] = useState(initialVisible)
  const [ popperElement, setPopperElement ] = useState(null)

  const hide = toggleVisible.bind(null, false)
  const show = e => {
    e.preventDefault()
    toggleVisible(true)
  }

  const { styles, attributes } = usePopper(containerRef.current, popperElement, {
    placement: 'right',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [20, -40]
        }
      }
    ]
  })

  function toggleVisible (value = !visible) {
    setVisible(value)

    if (visible !== value) {
      onChange(value)
    }
  }

  useEffect(() => {
    setVisible(initialVisible)
  }, [ initialVisible ])

  useEffect(() => {
    if (!visible) {
      containerRef.current.addEventListener('contextmenu', show)
    }

    return () => {
      containerRef.current?.removeEventListener('contextmenu', show)
    }
  }, [ visible ])

  useBlurHook(popperElement, hide)

  if (!visible) return null

  return <ContextMenuContainer
    ref={setPopperElement}
    style={styles.popper}
    {...attributes.popper}
    {...props}
  >
    { children }
  </ContextMenuContainer>
}

const ContextMenuContainer = styled('div')`
  z-index: 9;
`