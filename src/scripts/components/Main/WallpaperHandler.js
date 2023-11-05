import React, { useEffect, useRef } from 'react'

import styled from 'styled-components'

import { Settings } from 'scripts/methods/storage'
import { random } from 'scripts/methods/helpers'
import { formatHSL } from 'scripts/methods/colors'
import Events from 'scripts/methods/events'
import { useCustomEvent } from 'scripts/methods/hooks'
import { PexelsController } from 'scripts/methods/pexelsController'

export function WallpaperHandler () {
  const ref = useRef()

  const initWallpaper = async () => {
    const doFetchWallpaper = await Settings.get('fetch_wallpaper', false)

    doFetchWallpaper
      ? fetchWallpaper()
      : loadWallpaper()
  }

  const fetchWallpaper = async () => {
    const photos = await PexelsController.search()

    const randomPhoto = photos.pickRandom()

    setUrlWallpaper(randomPhoto.src.tiny, true)

    const img = new Image()

    img.onload = () => setUrlWallpaper(img.src)

    img.src = randomPhoto.src.original

    Events.trigger('wallpaper:loaded', randomPhoto)
  }

  const loadWallpaper = async () => {
    const wallpaper = await Settings.get('wallpaper', null)

    if (wallpaper) {
      setUrlWallpaper(wallpaper)
    } else {
      const start = random(360)
      ref.current.style.background = `fixed linear-gradient(45deg, ${formatHSL([start, 100, 50])}, ${formatHSL([start + 36, 100, 50])})`
    }

    Events.trigger('wallpaper:loaded', null)
  }

  const setUrlWallpaper = (url, blur = false) => {
    ref.current.style.background = `50% 50% / cover url("${url}")`

    if (blur) {
      ref.current.style.filter = ''
      ref.current.style.transform = ''
    } else {
      ref.current.style.filter = 'none'
      ref.current.style.transform = 'none'
    }
  }

  useCustomEvent('settings:wallpaper:update', initWallpaper)

  useEffect(() => {
    initWallpaper()
  }, [])

  return <WallpaperContainer ref={ref} />
}

const WallpaperContainer = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw; // ignores scrollbar width
  height: 100%;
  background: 50% 50% / cover;
  filter: blur(10px);
  transform: scale(1.025);
  z-index: -1;
  pointer-events: none;
  transition: filter 1s ease, transform 1s ease;
`