import React, { useRef, useState } from 'react'

import styled, { css } from 'styled-components'
import { SourceContextMenu } from 'scripts/components/Social/SourcesSelector/SourceContextMenu'
import { mergeClasses } from 'scripts/methods/helpers'
import { SocialIcon } from 'scripts/components/ui/SocialIcon'

/**
 * @param {AbstractSource} source
 * @param {boolean} active
 * @param {React.HTMLProps} props
 * @return {JSX.Element}
 * @constructor
 */
export function VerticalItem ({ source, active = false, ...props }) {
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
        <div className={mergeClasses('col-auto', source.hidden && 'opacity-50')}>
          <SocialIcon type={source.type} />
        </div>
        <div className='col text-truncate'>{ source.name ?? source.key }</div>
        {
          source.key && <div className='col-auto'>
            <button className='icon-button fs-7' onClick={openContextMenu}>
              <i className='bi bi-three-dots-vertical' />
            </button>
          </div>
        }
      </div>
    </Container>
    <SourceContextMenu
      containerRef={ref}
      source={source}
      visible={menuVisible}
      onChange={setMenuVisible}
    />
  </>
}

const Container = styled('div')`
  padding: 4px 6px;
  border-radius: 8px;
  cursor: pointer;
  
  svg, i {
    color: var(--bs-gray-500);
  }
  
  .icon-button {
    opacity: 0;
  }
  
  &:hover .icon-button {
    opacity: 1;
  }
  
  ${({ $active }) => $active && css`
    background: rgba(var(--bs-primary-rgb), 0.2);
    
    &, svg, i {
      color: var(--bs-primary);
    }
  `}
`