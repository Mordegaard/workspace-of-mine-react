import React, { useCallback, useState } from 'react'

import debounce from 'debounce'
import { usePopper } from 'react-popper'

import styled from 'styled-components'

import { PopperPortal } from 'scripts/components/ui/Helpers/PopperPortal'

export function Tooltip ({
                           children,
                           content,
                           placement = 'top',
                           showArrow = true,
                           delay = 250,
                           popperOptions = {}
}) {
  const [ visible, setVisible ] = useState(false)
  const [ containerElement, setContainerElement ] = useState(null)
  const [ popperElement, setPopperElement ] = useState(null)

  const debouncedSetVisible = useCallback(debounce(setVisible, delay), [ delay ])

  const { styles, attributes } = usePopper(containerElement, popperElement, {
    placement,
    ...popperOptions,
  })

  return <>
    {
      React.cloneElement(children, {
        ref: setContainerElement,
        onMouseOver: debouncedSetVisible.bind(null, true),
        onMouseLeave: debouncedSetVisible.bind(null, false)
      })
    }
    {
      visible && <PopperPortal>
        <TooltipContainer
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          { content }
          {
            showArrow && <div data-popper-arrow={true} style={styles.arrow} />
          }
        </TooltipContainer>
      </PopperPortal>
    }
  </>
}

export function OptionalTooltip ({ condition, children, ...props }) {
  if (!condition) return children

  return <Tooltip {...props}>{ children }</Tooltip>
}

const ARROW_SIZE = 8

const TooltipContainer = styled('div')`
  padding: 1px 6px;
  border-radius: 8px;
  background: var(--bs-pastel-blue-800);
  color: white;
  font-size: 0.75rem;
  z-index: 99;

  &[data-popper-placement^='top'] > [data-popper-arrow] {
    bottom: -${ARROW_SIZE / 2}px;
  }

  &[data-popper-placement^='bottom'] > [data-popper-arrow] {
    top: -${ARROW_SIZE / 2}px;
  }

  &[data-popper-placement^='left'] > [data-popper-arrow] {
    right: -${ARROW_SIZE / 2}px;
  }

  &[data-popper-placement^='right'] > [data-popper-arrow] {
    left: -${ARROW_SIZE / 2}px;
  }
  
  [data-popper-arrow], [data-popper-arrow]:before {
    position: absolute;
    width: ${ARROW_SIZE}px;
    height: ${ARROW_SIZE}px;
    background: inherit;
  }

  [data-popper-arrow] {
    visibility: hidden;
  }

  [data-popper-arrow]:before {
    visibility: visible;
    content: '';
    transform: rotate(45deg);
  }
`