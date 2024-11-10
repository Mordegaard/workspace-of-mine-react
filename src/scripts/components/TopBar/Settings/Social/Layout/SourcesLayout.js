import React from 'react'

import styled, { css } from 'styled-components'

import { THREE_COLUMNS_MODE, TWO_COLUMNS_MODE } from 'scripts/methods/constants'

import ThreeColumnsLayoutIcon from 'assets/icons/layout/3-column.svg'
import TwoColumnsLayoutIcon from 'assets/icons/layout/2-column.svg'

export function SourcesLayout ({ settings, updateSettings }) {
  const selectedMode = settings.layout.social_mode ?? 0

  function updateLayout (layout) {
    updateSettings('layout.social_mode', layout)
  }

  return <>
    <div className='text-center fw-bold'>Стиль постів</div>
    <div className='row justify-content-center'>
      <CardContainer className='col-auto' $selected={selectedMode === THREE_COLUMNS_MODE}>
        <Card onClick={() => updateLayout(THREE_COLUMNS_MODE)}>
          <ThreeColumnsLayoutIcon />
        </Card>
        <div className='fs-7 text-center'>У три колонки</div>
      </CardContainer>
      <CardContainer className='col-auto' $selected={selectedMode === TWO_COLUMNS_MODE}>
        <Card onClick={() => updateLayout(TWO_COLUMNS_MODE)}>
          <TwoColumnsLayoutIcon />
        </Card>
        <div className='fs-7 text-center'>У дві колонки</div>
      </CardContainer>
    </div>
  </>
}

const CARD_SIZE = 160

const Card = styled('div')`
  width: ${CARD_SIZE}px;
  height: ${CARD_SIZE}px;
  padding: 4px;
  border-radius: 8px;
  border: 2px solid currentColor;
  cursor: pointer;
  overflow: hidden;
  
  svg {
    width: 100%;
    height: 100%;
    border-radius: 8px;
  }
`

const CardContainer = styled('div')`
  ${({ $selected }) => $selected
          ? css`color: var(--bs-primary);`
          : css`color: #999;`
  }
  
  ${Card} svg {
    ${({ $selected }) => $selected
            ? css`color: rgba(var(--bs-primary-rgb), 0.25);`
            : css`color: #cfcfcf;`
    }
  }
`