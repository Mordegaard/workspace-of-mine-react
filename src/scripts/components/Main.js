import React from 'react'

import styled from 'styled-components'

import { Bookmarks } from 'scripts/components/Main/Bookmarks'
import { DeleteSource } from 'scripts/components/Dialogs/DeleteSource'
import { EditBookmark } from 'scripts/components/Dialogs/EditBookmark'

export function Main () {
  return <Container className='flexed'>
    <Bookmarks />
    {/* Dialogs go below */}
    <DeleteSource />
    <EditBookmark />
  </Container>
}

const Container = styled('div')`
  width: 100%;
  height: 80vh;
`