import React, { useEffect, useState } from 'react'

import styled, { css } from 'styled-components'

import SocialController from 'scripts/methods/social'
import { useCustomEvent } from 'scripts/methods/hooks'
import { AddSource } from 'scripts/components/Social/SourcesSelector/AddSource'
import { Item } from 'scripts/components/Social/SourcesSelector/Item'

export function SourcesSelector ({ selected, onSelect }) {
  const [ sources, setSources ] = useState([])
  const [ isAdding, setIsAdding ] = useState(false)

  async function getSources () {
    const sources = await SocialController.sources.get()

    setSources(sources)
  }

  useEffect(() => {
    getSources()
  }, [])

  useCustomEvent('sources:updated', ({ detail }) => setSources(detail))

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