import React, { useEffect, useState } from 'react'

import styled from 'styled-components'

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
    <List className='col'>
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
`