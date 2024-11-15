import React, { useState, useRef } from "react"

import { Manager, Reference, Popper } from "react-popper"

import styled, { css, keyframes } from 'styled-components'
import { PopperPortal } from 'scripts/components/ui/Helpers/PopperPortal'
import { useBlurHook } from 'scripts/methods/hooks'

/**
 * @typedef {Object} DropdownItem
 * @property value
 * @property label
 */

/**
 *
 * @param                      children
 * @param {boolean}            withPortal
 * @param {DropdownItem[]}     items
 * @param                      selected
 * @param {boolean}            disabled
 * @param {number|undefined}   height
 * @param {function|undefined} onItemSelect
 * @return {JSX.Element}
 * @constructor
 */
export function Dropdown ({ children, withPortal = false, items = [], selected = null, disabled = false, height = 250, onItemSelect }) {
  const [ visible, setVisible ] = useState(false)

  const referenceRef = useRef(null)
  const popperRef = useRef(null)

  const MenuContainer = withPortal ? PopperPortal : React.Fragment

  function toggle (evt = null) {
    if (disabled) return

    if (evt) {
      evt.stopPropagation()
    }

    setVisible(!visible)
    typeof update === 'function' && update()
  }

  function getParameter (item, parameter) {
    return typeof item === 'string' ? item : item[parameter]
  }

  function select (evt, item) {
    evt.stopPropagation()

    if (typeof onItemSelect === 'function') onItemSelect(getParameter(item, 'value'))

    toggle()
  }

  useBlurHook(popperRef, setVisible.bind(null, false))

  return <Manager>
    <Reference>
      {
        (({ ref: setRef }) =>
          React.Children.map(children, child =>
            React.cloneElement(child, {
              onClick: toggle,
              ref: ref => {
                setRef(ref)
                referenceRef.current = ref
              }
            })
          )
        )
      }
    </Reference>
    {
      visible && <MenuContainer>
        <Popper placement='bottom-start'>
          {({ ref: setRef, style }) => (
            <div
              ref={ref => {
                setRef(ref)
                popperRef.current = ref
              }}
              style={{ ...style, zIndex: 3 }}
            >
              <Menu height={height} width={referenceRef.current.offsetWidth}>
                {
                  items.map((item, index) =>
                    <Item selected={getParameter(item, 'value') === selected} key={index} onClick={e => select(e, item)}>
                      {
                        getParameter(item, 'label')
                      }
                    </Item>
                  )
                }
              </Menu>
            </div>
          )}
        </Popper>
      </MenuContainer>
    }
  </Manager>
}

export const Select = React.forwardRef(({ children, ...props }, ref) =>
  <SelectContainer { ...props } ref={ref}>
    { children }
    <i className='bi bi-chevron-down mx-1 fs-8 lh-0 text-gray' />
  </SelectContainer>
)

Select.displayName = 'Select'

const SelectContainer = styled('button')`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const opening = keyframes`
  from { transform: translateY(12px); }
  to { transform: none; }
`

const Menu = styled('div')`
  display: flex;
  flex-direction: column;
  background-color: var(--bs-white);
  border-radius: 8px;
  box-shadow: 2px 2px 12px -2px #00000036;
  padding: 8px 0;
  max-height: ${({ height }) => height}px;
  min-width: ${({ width }) => width}px;
  overflow-y: auto;
  animation: ${opening} 0.25s ease;

  [data-bs-theme=dark] & {
    background-color: var(--bs-gray-200);
  }
`

const Item = styled('div')`
  position: relative;
  padding: 4px 20px;\
  cursor: pointer;

  &:hover {
    background: var(--bs-gray-100);
  }

  [data-bs-theme=dark] &:hover {
    background: var(--bs-gray-300);
  }

  ${({ selected }) => selected && css`
    color: var(--bs-primary);

    &:before {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      width: 4px;
      height: 100%;
      border-radius: 0 4px 4px 0;
      background: var(--bs-primary);
      transform: translateY(-50%);
    }
  `}
`
