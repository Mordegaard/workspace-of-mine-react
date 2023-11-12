import React, { useRef, useState } from 'react'

import styled, { css } from 'styled-components'

import { mergeClasses } from 'scripts/methods/helpers'
import { SocialIcon } from 'scripts/components/ui/SocialIcon'
import { AnimatedContextMenuContainer, ContextMenu } from 'scripts/components/ui/Helpers/ContextMenu'
import { PopperPortal } from 'scripts/components/ui/Helpers/PopperPortal'
import Events from 'scripts/methods/events'
import { SocialController } from 'scripts/methods/social'

/**
 * @param {SocialSource} source
 * @param {boolean} active
 * @param {React.HTMLProps} props
 * @return {JSX.Element}
 * @constructor
 */
export function Item ({ source, active = false, ...props }) {
  const [ menuVisible, setMenuVisible ] = useState(false)

  const ref = useRef()

  function openContextMenu (e) {
    e.preventDefault()
    e.stopPropagation()
    setMenuVisible(true)
  }

  return <>
    <Container ref={ref} $active={active} {...props}>
      <div className='row gx-2 align-items-center flex-nowrap'>
        {
          source.key && <div className={mergeClasses('col-auto text-gray-500', source.hidden && 'opacity-50')}>
            <SocialIcon type={source.type} />
          </div>
        }
        <div className='col'>{ source.name ?? source.key }</div>
        {
          source.key && <div className='col-auto'>
            <button className='icon-button fs-7' onClick={openContextMenu}>
              <i className='bi bi-three-dots-vertical' />
            </button>
          </div>
        }
      </div>
    </Container>
    {
      source.key && <PopperPortal>
        <ContextMenu
          containerRef={ref}
          visible={menuVisible}
          onChange={setMenuVisible}
        >
          <AnimatedContextMenuContainer>
            <button
              className='btn btn-sm btn-basic-primary w-100 d-block'
              onClick={() => {
                SocialController.sources.update(source.key, { hidden: !source.hidden })
                  .then(setMenuVisible.bind(null, false))
              }}
            >
              <div className='w-100 text-start'>
                {
                  source.hidden
                    ? <i className='bi bi-eye-slash me-3' />
                    : <i className='bi bi-eye me-3' />
                }
                { source.hidden ? 'Не приховувати' : 'Приховати' }
              </div>
            </button>
            <button
              className='btn btn-sm btn-basic-danger w-100 d-block'
              onClick={() => Events.trigger('dialog:sources:remove', source)}
            >
              <div className='w-100 text-start'>
                <i className='bi bi-trash me-3' />
                Видалити
              </div>
            </button>
          </AnimatedContextMenuContainer>
        </ContextMenu>
      </PopperPortal>
    }
  </>
}

const Container = styled('div')`
  position: relative;
  color: var(--bs-gray-600);
  transition: transform 0.25s ease;
  
  & > div {
    position: relative;
    background: var(--bs-gray-100);
    padding: 4px 8px;
    border-radius: 666px;
    margin: 0 6px;
    box-shadow: -1px 1px 12px -8px black;
    cursor: pointer;
    text-wrap: nowrap;
    z-index: 1;
  }
  
  &:before, &:after {
    position: absolute;
    left: 50%;
    border-radius: 666px;
    background: var(--bs-primary);
    transform: translate(-50%, -50%) scale(0);
    transition: transform 0.25s ease;
  }
  
  &:before {
    content: "";
    bottom: -6px;
    width: 50%;
    height: 6px;
    z-index: 0;
  }
  
  &:after {
    content: "\\f26e";
    display: inline-block;
    font-family: "bootstrap-icons";
    top: 100%;
    color: white;
    line-height: 1;
    z-index: 1;
  }
  
  ${({ $active }) => $active && css`
    color: var(--bs-primary);
    transform: translateY(-4px);
    
    &:before, &:after {
      transform: translate(-50%, -50%);
    }
  `}
`