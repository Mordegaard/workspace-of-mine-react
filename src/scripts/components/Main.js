import React, { useEffect } from 'react'

import styled from 'styled-components'

import { Settings } from 'scripts/methods/storage'
import { formatHSL } from 'scripts/methods/colors'
import { random } from 'scripts/methods/helpers'

export function Main () {
  async function loadBackground () {
    const background = await Settings.get('background', null)

    if (background) {
      document.body.style.background = `50% 50% /100% url("${background}")`
    } else {
      const start = random(360)
      document.body.style.background = `linear-gradient(45deg, ${formatHSL([start, 100, 50])}, ${formatHSL([start + 36, 100, 50])})`
    }
  }

  useEffect(() => {
    loadBackground()
  }, [])

  return <Container>
  </Container>
}

const Container = styled('div')`
  width: 100%;
  height: 80vh;
`