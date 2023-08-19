import React from 'react'

import styled from 'styled-components'

import { TopBar } from 'scripts/components/TopBar'
import { Main } from 'scripts/components/Main'
import { Social } from 'scripts/components/Social'

export function Layout () {
  return <Container>
    <TopBar />
    <Main />
    <Social />
  </Container>
}

const Container = styled('div')`
  width: 100vw;
`