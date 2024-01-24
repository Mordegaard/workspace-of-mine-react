import React from 'react'

import styled from 'styled-components'

import { TopBar } from 'scripts/components/TopBar'
import { Main } from 'scripts/components/Main'
import { Social } from 'scripts/components/Social'
import { WallpaperHandler } from 'scripts/components/WallpaperHandler'
import { AccentColorHandler } from 'scripts/components/AccentColorHandler'

export function Layout () {
  return <Container>
    <WallpaperHandler />
    <AccentColorHandler />
    <TopBar />
    <Main />
    <Social />
  </Container>
}

const Container = styled('div')`
  width: 100%;
`