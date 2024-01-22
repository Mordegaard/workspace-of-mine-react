import React, { useEffect, useRef, useState } from 'react'

import { addDays, set } from 'date-fns'

import styled, { css } from 'styled-components'

import { DEFAULT_SETTINGS, Settings } from 'scripts/methods/storage'
import { random } from 'scripts/methods/helpers'
import { formatHSL } from 'scripts/methods/colors'
import Events from 'scripts/methods/events'
import { useCustomEvent } from 'scripts/methods/hooks'
import { PexelsController } from 'scripts/methods/pexelsController'

export function WallpaperHandler () {
  const [ settings, setSettings ] = useState(DEFAULT_SETTINGS)

  const now = new Date()

  let startDarken = set(now, { hours: settings.darken_wallpaper_start, minutes: 0, seconds: 0, milliseconds: 0 })
  let endDarken =  set(now, { hours: settings.darken_wallpaper_end, minutes: 0, seconds: 0, milliseconds: 0 })

  if (settings.darken_wallpaper_start >= settings.darken_wallpaper_end) {
    endDarken = addDays(endDarken, 1)
  }

  const doDarken = settings.darken && now > startDarken && now < endDarken

  const ref = useRef()

  const initWallpaper = async () => {
    const settings = { ...DEFAULT_SETTINGS, ...await Settings.get() }

    setSettings(settings)

      settings.fetch_wallpaper
      ? fetchWallpaper(settings)
      : loadWallpaper(settings)
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

  const loadWallpaper = async (settings) => {
    const { wallpaper } = settings

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
  useCustomEvent('settings:fetch_wallpaper:update', initWallpaper)

  useEffect(() => {
    initWallpaper()
  }, [])

  return <WallpaperContainer ref={ref} $darken={doDarken} />
}

const WallpaperContainer = styled('div')`
  background: 50% 50% / cover;
  filter: blur(10px);
  transform: scale(1.025);
  z-index: -1;
  pointer-events: none;
  transition: filter 1s ease, transform 1s ease;
  
  &, &:after {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw; // ignores scrollbar width
    height: 100%;
  }
  
  &:after {
    content: "";
    opacity: 0;
    transition: opacity 0.5s ease;
    background-color: black;
  }
  
  ${({ $darken }) => $darken && css`
    &:after {
      opacity: 0.6;
    }
  `}
`