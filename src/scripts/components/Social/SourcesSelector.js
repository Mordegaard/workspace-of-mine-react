import React, { useState } from 'react'

import styled, { css } from 'styled-components'

import { AddSource } from 'scripts/components/Social/SourcesSelector/AddSource'
import { Item } from 'scripts/components/Social/SourcesSelector/Item'

export function SourcesSelector ({ sources, selected, onSelect }) {

  const [ isAdding, setIsAdding ] = useState(false)

  return <div className='row'>
    <List className='col' $isAdding={isAdding}>
      <Item
        className='fw-bold'
        source={{ name: 'Усі джерела' }}
        active={selected == null}
        onClick={onSelect.bind(null, null)}
      />
      {
        sources.map((source, index) =>
          <Item
            key={index}
            source={source}
            active={selected?.key === source.key}
            onClick={onSelect.bind(null, source)}
          />
        )
      }
    </List>
    <ButtonContainer className='col-auto'>
      <AddSource active={isAdding} onActiveChange={setIsAdding} />
    </ButtonContainer>
  </div>
}

const sharedStyles = css`
  padding-top: 8px;
  padding-bottom: 8px;
`

const List = styled('div')`
  ${sharedStyles};
  
  display: flex;
  overflow: hidden;
  transition: opacity 0.25s ease;
  
  ${({ $isAdding }) => $isAdding && css`
    opacity: 0;
    pointer-events: none;
  `}
`

const ButtonContainer = styled('div')`
  ${sharedStyles};
`