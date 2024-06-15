import React, { useEffect } from 'react'

import styled, { keyframes, css } from 'styled-components'
import { mergeClasses } from 'scripts/methods/helpers'

export function Modal ({ children, width, title, scrollable = true, withContainer = true, onClose, ...props }) {
  function close () {
    typeof onClose === 'function' && onClose()
  }

  function handleEsc (e) {
    e.key === 'Escape' && close()
  }

  useEffect(() => {
    window.addEventListener('keydown', handleEsc)

    document.body.classList.add('modal-visible')

    return () => {
      window.removeEventListener('keydown', handleEsc)

      window.requestAnimationFrame(() => {
        if (document.getElementsByClassName(CONTAINER_CLASS).length === 0) {
          document.body.classList.remove('modal-visible')
        }
      })
    }
  }, [])

  return <OverflowContainer className={mergeClasses(CONTAINER_CLASS, 'flexed')}>
    <DarkBackground onClick={close} />
    {
      withContainer && <ModalContainer $width={width} { ...props }>
        {
          title && <ModalHeader className='row g-0 align-items-center'>
            <div className='col-1' />
            <div className='col-10 text-center h4 m-0 px-3'>{ title }</div>
            <div className='col-1 d-flex flex-row-reverse'>
              <button className='icon-button' onClick={close}>
                <i className='bi bi-x-lg p-1' />
              </button>
            </div>
          </ModalHeader>
        }
        {
          !title && <AbsoluteButton className='icon-button' onClick={close}>
            <i className='bi bi-x-lg p-1' />
          </AbsoluteButton>
        }
        <div className={ scrollable ? 'p-2 overflow-hidden' : 'py-2' }>
          <ModalBody $scrollable={scrollable} className='px-2'>
            {
              children
            }
          </ModalBody>
        </div>
      </ModalContainer>
    }
    {
      !withContainer && <>
        <AbsoluteButton className='icon-button' onClick={close}>
          <i className='bi bi-x-lg p-1' />
        </AbsoluteButton>
        { children }
      </>
    }
  </OverflowContainer>
}

const CONTAINER_CLASS = 'modal-overflow-container'

const fixed = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

const OverflowContainer = styled('div')`
  ${fixed};
  color: white;
  z-index: 9;
`

const DarkBackground = styled('div')`
  ${fixed};
  background: #000218b0;
`

const opening = keyframes`
  from { opacity: 0; transform: translateY(10px) scale(0.95); }
  to { opacity: 1; transform: none; }
`

const ModalContainer = styled('div')`
  display: flex;
  flex-direction: column;
  position: relative;
  max-width: 90vw;
  background: var(--bs-gray-100);
  border-radius: 24px;
  color: var(--bs-gray-800);
  font-size: var(--bs-body-font-size);
  animation: ${opening} 0.25s ease;

  ${({ $width }) => $width && `width: ${$width};`}
`

const ModalHeader = styled('div')`
  border-bottom: 1px solid #d7d4dc;
  padding: 1rem 1.5rem 0.5rem 1.5rem;
`

const ModalBody = styled('div')`
  height: 100%;
  max-height: 82vh;
  
  ${({ $scrollable }) => $scrollable && css`
    overflow-y: auto;
    overflow-x: hidden;
  `};

  @media (min-width: 576px) {
    &::-webkit-scrollbar, & *::-webkit-scrollbar {
      width: 8px;
      background: transparent;
    }

    &::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb {
      border-radius: 666px;
      background: #c6c6c6;
    }
  }
`

const AbsoluteButton = styled('button')`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 2;
`