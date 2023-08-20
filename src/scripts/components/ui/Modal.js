import React from 'react'

import styled, { keyframes, css } from 'styled-components'

export function Modal ({ children, width, title, className, onClose }) {
  function close () {
    typeof onClose === 'function' && onClose()
  }

  return <OverflowContainer className='flexed'>
    <DarkBackground onClick={close} />
    <ModalContainer $width={width} className={className}>
      <ModalHeader border={!!title} className='row g-0 align-items-center'>
        <div className='col-1'></div>
        <div className="col-10 text-center h4 m-0 px-3">{ title }</div>
        <div className='col-1 d-flex flex-row-reverse'>
          <button className='icon-button' onClick={close}>
            <i className='bi bi-x-lg p-1' />
          </button>
        </div>
      </ModalHeader>
      <div className="p-2">
      <ModalBody className='p-2 pt-0'>
        {
          children
        }
      </ModalBody>
      </div>
    </ModalContainer>
  </OverflowContainer>
}

const fixed = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

const OverflowContainer = styled('div')`
  ${fixed};
  z-index: 99;
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
  position: relative;
  max-width: 90vw;
  background: var(--bs-pastel-gray-100);
  border-radius: 24px;
  color: var(--bs-pastel-gray-800);
  animation: ${opening} 0.25s ease;

  ${({ $width }) => $width && `width: ${$width};`}
`

const ModalHeader = styled('div')`
  ${({ border }) => border ? `
    border-bottom: 1px solid #c7c4cd;
    padding: 1rem 1.5rem 0.5rem 1.5rem;
  ` : `
    padding: 0.5rem 0.5rem 0.25rem 0.5rem;
  `}
`

const ModalBody = styled('div')`
  max-height: 82vh;
  overflow-y: auto;
  overflow-x: hidden;

  @media (min-width: 576px) {
    &::-webkit-scrollbar {
      width: 8px;
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 666px;
      background: #c6c6c6;
    }
  }
`
