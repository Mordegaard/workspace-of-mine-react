import React from 'react'

import styled from 'styled-components'

import { TopBar } from 'scripts/components/TopBar'
import { Main } from 'scripts/components/Main'
import { Social } from 'scripts/components/Social'
import { WallpaperHandler } from 'scripts/components/Main/WallpaperHandler'

export function Layout () {
  return <Container>
    <WallpaperHandler />
    <TopBar />
    <Main />
    <Social />
  </Container>
}

const Container = styled('div')`
  width: 100%;
`