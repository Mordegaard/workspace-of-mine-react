import React from 'react'

import styled from 'styled-components'

import { RoundButton } from 'scripts/components/Social/SourcesSelector/RoundButton'
import Events from 'scripts/methods/events'

export function AddSourceButton () {
  return <ButtonContainer>
    <RoundButton className='position-relative' onClick={() => Events.trigger('dialog:sources:add')}>
      <i className='bi bi-plus-lg' />
    </RoundButton>
  </ButtonContainer>
}

const ButtonContainer = styled('div')`
  position: relative;
  
  &:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: var(--bs-primary);
    transform: translate(-50%, -50%) scale(4);
    opacity: 0;
    pointer-events: none;
    transition: transform 0.33s, opacity 0.33s;
    z-index: 0;
  }
  
  &:active:before {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.666;
    transition: none;
  }
`