import React from 'react'

import styled, { css } from 'styled-components'

import SocialController from 'scripts/methods/social'
import { mergeClasses } from 'scripts/methods/helpers'
import { SocialIcon } from 'scripts/components/ui/SocialIcon'

/**
 * @param {SocialSource} source
 * @param {boolean} active
 * @param {React.HTMLProps} props
 * @return {JSX.Element}
 * @constructor
 */
export function Item ({ source, active = false, ...props }) {
  async function deleteSource (e) {
    e.stopPropagation()
    await SocialController.sources.remove(source.key)
  }

  return <Container $active={active} {...props}>
    <div className='row gx-2 align-items-center flex-nowrap'>
      {
        source.key && <div className={mergeClasses('col-auto text-pastel-gray-500', source.hidden && 'opacity-50')}>
          <SocialIcon type={source.type} />
        </div>
      }
      <div className='col'>{ source.name ?? source.key }</div>
      {
        source.key && <div className='col-auto'>
          <button className='icon-button danger fs-7' onClick={deleteSource}>
            <i className='bi bi-x' />
          </button>
        </div>
      }
    </div>
  </Container>
}

const Container = styled('div')`
  position: relative;
  color: var(--bs-pastel-gray-600);
  transition: transform 0.25s ease;
  
  & > div {
    position: relative;
    background: var(--bs-pastel-gray-100);
    padding: 4px 8px;
    border-radius: 666px;
    margin: 0 6px;
    box-shadow: -1px 1px 12px -8px black;
    cursor: pointer;
    text-wrap: nowrap;
    z-index: 1;
  }
  
  &:before {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    width: 50%;
    height: 6px;
    border-radius: 666px;
    background: var(--bs-primary);
    transform: translate(-50%, -50%) scale(0);
    transition: transform 0.25s ease;
    z-index: 0;
  }
  
  ${({ $active }) => $active && css`
    color: var(--bs-primary);
    transform: translateY(-4px);
    
    &:before {
      transform: translate(-50%, -50%);
    }
  `}
`