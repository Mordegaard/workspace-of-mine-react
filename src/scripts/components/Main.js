import React from 'react'

import styled from 'styled-components'

import { WallpaperHandler } from 'scripts/components/Main/WallpaperHandler'
import { Bookmarks } from 'scripts/components/Main/Bookmarks'
import { DeleteSource } from 'scripts/components/Dialogs/DeleteSource'
import { EditBookmark } from 'scripts/components/Dialogs/EditBookmark'

export function Main () {
  return <Container className='flexed'>
    <Bookmarks />
    <WallpaperHandler />
    {/* Dialogs go below */}
    <DeleteSource />
    <EditBookmark />
  </Container>
}

const Container = styled('div')`
  width: 100%;
  height: 80vh;
`