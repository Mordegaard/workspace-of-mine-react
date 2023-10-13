import React, { useEffect } from 'react'

import styled from 'styled-components'

import { WallpaperHandler } from 'scripts/components/Main/WallpaperHandler'
import { Bookmarks } from 'scripts/components/Main/Bookmarks'
import { DeleteSource } from 'scripts/components/Dialogs/DeleteSource'
import { EditBookmark } from 'scripts/components/Dialogs/EditBookmark'
import { useCustomEvent } from 'scripts/methods/hooks'
import { formatRGB, hexToRgb } from 'scripts/methods/colors'
import { Settings } from 'scripts/methods/storage'
import { DEFAULT_ACCENT_COLOR } from 'scripts/methods/constants'

export function Main () {
  function initColors (hexPrimaryColor) {
    const setColor = (style, colorArray) => {
      document.body.style.setProperty(`${style}-rgb`, colorArray.join())
      document.body.style.setProperty(style, formatRGB(colorArray))
    }

    const rgbPrimaryColor = hexToRgb(hexPrimaryColor)
    const rgbDarkerColor = rgbPrimaryColor.map(value => Math.round(value * 0.8))
    const rgbLighterColor = rgbPrimaryColor.map(value => Math.round(value * 1.2))

    setColor('--bs-primary', rgbPrimaryColor)
    setColor('--bs-primary-darker', rgbDarkerColor)
    setColor('--bs-primary-lighter', rgbLighterColor)
  }

  useCustomEvent('settings:accent_color:update', ({ detail }) => initColors(detail ?? DEFAULT_ACCENT_COLOR))
  useEffect(() => {
    Settings.get('accent_color', DEFAULT_ACCENT_COLOR).then(initColors)
  }, [])

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