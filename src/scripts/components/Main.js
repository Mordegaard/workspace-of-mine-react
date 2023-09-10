import React from 'react'

import styled from 'styled-components'

import { WallpaperHandler } from 'scripts/components/Main/WallpaperHandler'

export function Main () {

  return <Container>
    <WallpaperHandler />
  </Container>
}

const Container = styled('div')`
  width: 100%;
  height: 80vh;
`