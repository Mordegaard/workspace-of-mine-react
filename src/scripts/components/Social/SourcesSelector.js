import React, { useEffect, useState } from 'react'

import styled, { css } from 'styled-components'

import SocialSourcesController from 'scripts/methods/socialSources'
import { useCustomEvent } from 'scripts/methods/hooks'
import { AddSource } from 'scripts/components/Social/SourcesSelector/AddSource'
import { Item } from 'scripts/components/Social/SourcesSelector/Item'

export function SourcesSelector () {
  const [ sources, setSources ] = useState([])
  const [ isAdding, setIsAdding ] = useState(false)

  async function getSources () {
    const sources = await SocialSourcesController.get()

    setSources(sources)
  }

  useEffect(() => {
    getSources()
  }, [])

  useCustomEvent('sources:updated', ({ detail }) => setSources(detail))

  return <div className='row'>
    <List className='col' $isAdding={isAdding}>
      {
        sources.map((source, index) =>
          <Item key={index} source={source} />
        )
      }
    </List>
    <div className='col-auto'>
      <AddSource active={isAdding} onActiveChange={setIsAdding} />
    </div>
  </div>
}

const List = styled('div')`
  display: flex;
  transition: opacity 0.25s ease;
  
  ${({ $isAdding }) => $isAdding && css`
    opacity: 0;
    pointer-events: none;
  `}
`