import React from 'react'

import styled from 'styled-components'

import { WallpaperHandler } from 'scripts/components/Main/WallpaperHandler'
import { DeleteSource } from 'scripts/components/Social/DeleteSource'

export function Main () {
  return <Container>
    <WallpaperHandler />
    <DeleteSource />
  </Container>
}

const Container = styled('div')`
  width: 100%;
  height: 80vh;
`